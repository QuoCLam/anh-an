from .database import SessionLocal, engine
from .models import Base, User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_admin():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    if not db.query(User).filter_by(username="admin").first():
        admin = User(username="admin", password=pwd_context.hash("123456"), role="admin")
        db.add(admin)
        db.commit()
        print("Admin user created: admin / 123456")
    else:
        print("Admin already exists")
    db.close()

if __name__ == "__main__":
    seed_admin()
