from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from .database import SessionLocal
from .models import User
from . import auth
from . import schemas
import os
from .schemas import UserOut

print("=== RUNNING MAIN.PY AT:", os.path.abspath(__file__))

app = FastAPI(title="User Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # chỉnh lại origin nếu cần
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Không thể xác thực token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    user = auth.decode_access_token(token, db)
    if not user:
        raise credentials_exception
    return user

def require_admin(user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Chỉ admin được phép thực hiện chức năng này")
    return user

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Sai tài khoản hoặc mật khẩu")
    access_token = auth.create_access_token({"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=UserOut)
def get_me(user: User = Depends(get_current_user)):
    return user  # để FastAPI tự map sang schema UserOut

# ======================= API QUẢN LÝ USER CHO ADMIN ============================

@app.get("/users", response_model=list[schemas.UserOut])
def get_users(db: Session = Depends(get_db), user: User = Depends(require_admin)):
    return db.query(User).all()

@app.post("/users", response_model=schemas.UserOut)
def create_user(user_in: schemas.UserCreate, db: Session = Depends(get_db), user: User = Depends(require_admin)):
    if db.query(User).filter_by(username=user_in.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_password = auth.pwd_context.hash(user_in.password)
    new_user = User(username=user_in.username, password=hashed_password, role=user_in.role, department=user_in.department)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.delete("/users/{user_id}", response_model=dict)
def delete_user(user_id: int, db: Session = Depends(get_db), user: User = Depends(require_admin)):
    user_db = db.query(User).filter_by(id=user_id).first()
    if not user_db:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user_db)
    db.commit()
    return {"msg": "User deleted"}

@app.put("/users/{user_id}", response_model=schemas.UserOut)
def update_user(user_id: int, user_in: schemas.UserCreate, db: Session = Depends(get_db), user: User = Depends(require_admin)):
    user_db = db.query(User).filter_by(id=user_id).first()
    if not user_db:
        raise HTTPException(status_code=404, detail="User not found")
    user_db.username = user_in.username
    user_db.role = user_in.role
    user_db.department = user_in.department
    if user_in.password:
        user_db.password = auth.pwd_context.hash(user_in.password)
    db.commit()
    db.refresh(user_db)
    return user_db

@app.get("/ping")
def ping():
    return {"msg": "pong"}
