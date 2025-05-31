from sqlmodel import create_engine, Session, SQLModel

DATABASE_URL = "postgresql://postgres:355355@localhost:5432/nhacnho"

engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
