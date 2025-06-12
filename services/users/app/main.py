from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from typing import List, Optional

from .database import SessionLocal
from .models import User, Department
from . import auth, schemas

app = FastAPI(title="User Service")

# --------------------------- CORS ---------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # production: thay domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------- DEPENDENCIES -----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def get_current_user(token: str = Depends(oauth2_scheme),
                     db: Session = Depends(get_db)) -> User:
    user = auth.decode_access_token(token, db)
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED,
                            "Không thể xác thực token",
                            headers={"WWW-Authenticate": "Bearer"})
    return user


def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN,
                            "Chỉ admin được phép thực hiện chức năng này")
    return user

# -------------------------- AUTH ----------------------------------
@app.post("/login", response_model=schemas.Token)
def login(form: OAuth2PasswordRequestForm = Depends(),
          db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form.username).first()
    if not user or not auth.verify_password(form.password, user.password):
        raise HTTPException(401, "Sai tài khoản hoặc mật khẩu")
    token = auth.create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.UserOut)
def read_me(current: User = Depends(get_current_user)):
    return current

# ------------------------- USERS CRUD -----------------------------
@app.get("/users", response_model=List[schemas.UserOut])
def list_users(db: Session = Depends(get_db),
               _: User = Depends(require_admin)):
    # Quan hệ department đã lazy="joined" nên tự nạp
    return db.query(User).all()


@app.post("/users", response_model=schemas.UserOut, status_code=201)
def create_user(user_in: schemas.UserCreate,
                db: Session = Depends(get_db),
                _: User = Depends(require_admin)):

    if db.query(Department).filter_by(id=user_in.department_id).first() is None \
            and user_in.department_id is not None:
        raise HTTPException(400, "Department id không tồn tại")

    def _sanitize(val: Optional[str]) -> Optional[str]:
        return val.strip() or None if val else None

    new_user = User(
        username=user_in.username.strip(),
        password=auth.get_password_hash(user_in.password),
        full_name=_sanitize(user_in.full_name),
        role=user_in.role,
        phone=_sanitize(user_in.phone),
        email=_sanitize(user_in.email),
        department_id=user_in.department_id,
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(400, "Username hoặc Email đã tồn tại")

    return new_user


@app.put("/users/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: int,
                user_in: schemas.UserUpdate,
                db: Session = Depends(get_db),
                current: User = Depends(require_admin)):

    user_db: User | None = db.query(User).filter_by(id=user_id).first()
    if not user_db:
        raise HTTPException(404, "User not found")

    # Không cho trùng username/email với user khác
    if (other := db.query(User).filter(User.username == user_in.username,
                                       User.id != user_id).first()):
        raise HTTPException(400, "Username đã tồn tại")

    if user_in.email and \
       db.query(User).filter(User.email == user_in.email,
                             User.id != user_id).first():
        raise HTTPException(400, "Email đã tồn tại")

    # Kiểm tra phòng ban hợp lệ
    if user_in.department_id and \
       not db.query(Department).filter_by(id=user_in.department_id).first():
        raise HTTPException(400, "Department id không tồn tại")

    # Cập nhật
    user_db.username      = user_in.username.strip()
    user_db.full_name     = (user_in.full_name or "").strip() or None
    user_db.phone         = (user_in.phone or "").strip() or None
    user_db.email         = (user_in.email or "").strip() or None
    user_db.role          = user_in.role
    user_db.department_id = user_in.department_id
    if user_in.password:
        user_db.password = auth.get_password_hash(user_in.password)

    db.commit()
    db.refresh(user_db)
    return user_db


@app.delete("/users/{user_id}", response_model=dict)
def delete_user(user_id: int,
                db: Session = Depends(get_db),
                current: User = Depends(require_admin)):

    user_db: User | None = db.query(User).filter_by(id=user_id).first()
    if not user_db:
        raise HTTPException(404, "User not found")

    # Không cho xoá chính mình
    if user_db.id == current.id:
        raise HTTPException(400, "Không thể xoá chính bạn")

    # Phải còn ít nhất một admin
    if user_db.role == "admin":
        admin_count = db.query(User).filter_by(role="admin").count()
        if admin_count <= 1:
            raise HTTPException(400, "Phải còn ít nhất 1 admin")

    db.delete(user_db)
    db.commit()
    return {"msg": "User deleted"}

# ----------------------- HEALTHCHECK ------------------------------
@app.get("/ping")
def ping():
    return {"msg": "pong"}
# -------------------- DEPARTMENTS CRUD --------------------
@app.get("/departments", response_model=List[schemas.DepartmentOut])
def list_departments(db: Session = Depends(get_db),
                     _: User = Depends(require_admin)):
    return db.query(Department).all()

@app.post("/departments", response_model=schemas.DepartmentOut, status_code=201)
def create_department(dep_in: schemas.DepartmentCreate,
                      db: Session = Depends(get_db),
                      _: User = Depends(require_admin)):
    if db.query(Department).filter_by(name=dep_in.name).first():
        raise HTTPException(400, "Department name duplicated")
    dep = Department(name=dep_in.name)
    db.add(dep); db.commit(); db.refresh(dep)
    return dep

@app.put("/departments/{dep_id}", response_model=schemas.DepartmentOut)
def update_department(dep_id: int,
                      dep_in: schemas.DepartmentUpdate,
                      db: Session = Depends(get_db),
                      _: User = Depends(require_admin)):
    dep = db.query(Department).get(dep_id)
    if not dep:
        raise HTTPException(404, "Department not found")
    if db.query(Department).filter(Department.id != dep_id,
                                   Department.name == dep_in.name).first():
        raise HTTPException(400, "Name duplicated")
    dep.name = dep_in.name
    db.commit(); db.refresh(dep)
    return dep

@app.delete("/departments/{dep_id}", response_model=dict)
def delete_department(dep_id: int,
                      db: Session = Depends(get_db),
                      _: User = Depends(require_admin)):
    dep = db.query(Department).get(dep_id)
    if not dep:
        raise HTTPException(404, "Department not found")
    if dep.users:           # còn user thuộc phòng – tuỳ bạn
        raise HTTPException(400, "Phòng ban vẫn còn nhân sự")
    db.delete(dep); db.commit()
    return {"msg": "Department deleted"}