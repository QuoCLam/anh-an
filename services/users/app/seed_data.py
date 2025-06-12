from app.database import SessionLocal
from app.models   import User, Department
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_admin():
    db = SessionLocal()

    # 1) Tạo phòng ban mặc định
    dept = db.query(Department).filter_by(name="Admin Dept").first()
    if not dept:
        dept = Department(name="Admin Dept")
        db.add(dept)
        db.commit()
        db.refresh(dept)

    # 2) Tạo user admin (nếu chưa có)
    if not db.query(User).filter_by(username="admin").first():
        admin = User(
            username="admin",
            password=pwd_context.hash("123456"),   # ← đúng cột `password`
            role="admin",
            department_id=dept.id
        )
        db.add(admin)
        db.commit()
        print("Admin user created: admin/123456")
    else:
        print("Admin already exists")

    db.close()

if __name__ == "__main__":
    seed_admin()
