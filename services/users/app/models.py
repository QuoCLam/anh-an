from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)

    users = relationship("User", back_populates="department")

    def __repr__(self):
        return f"<Department(id={self.id}, name='{self.name}')>"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password = Column(String(128), nullable=False)
    full_name = Column(String(100))
    role = Column(String(20), default="user", nullable=False)
    phone = Column(String(20))
    email = Column(String(100), unique=True, index=True)

    department_id = Column(Integer, ForeignKey("departments.id"))
    department = relationship(
        "Department",
        back_populates="users",
        lazy="joined"  # Eager‑load để frontend nhận được department name
    )

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', role='{self.role}')>"
