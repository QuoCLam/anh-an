from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from sqlmodel import Session, select
from typing import List
from app.models.lab_test import LabTest, LabTestCreate, LabTestRead, LabTestUpdate
from app.database import get_session
import os
import shutil

router = APIRouter(prefix="/labtests", tags=["Lab Tests"])

UPLOAD_FOLDER = "uploaded_files"  # Thư mục lưu file upload

# CRUD: Tạo mới LabTest
@router.post("/", response_model=LabTestRead)
def create_labtest(labtest: LabTestCreate, session: Session = Depends(get_session)):
    db_obj = LabTest.from_orm(labtest)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

# CRUD: Lấy tất cả LabTest
@router.get("/", response_model=List[LabTestRead])
def read_labtests(session: Session = Depends(get_session)):
    return session.exec(select(LabTest)).all()

# CRUD: Lấy 1 LabTest theo id
@router.get("/{labtest_id}", response_model=LabTestRead)
def get_labtest(labtest_id: int, session: Session = Depends(get_session)):
    obj = session.get(LabTest, labtest_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return obj

# CRUD: Sửa LabTest
@router.put("/{labtest_id}", response_model=LabTestRead)
def update_labtest(labtest_id: int, labtest: LabTestUpdate, session: Session = Depends(get_session)):
    db_obj = session.get(LabTest, labtest_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Not found")
    labtest_data = labtest.dict(exclude_unset=True)
    for k, v in labtest_data.items():
        setattr(db_obj, k, v)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

# CRUD: Xóa LabTest
@router.delete("/{labtest_id}")
def delete_labtest(labtest_id: int, session: Session = Depends(get_session)):
    db_obj = session.get(LabTest, labtest_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Not found")
    session.delete(db_obj)
    session.commit()
    return {"ok": True}

# UPLOAD FILE cho 1 LabTest (gắn luôn vào trường sample_file)
@router.post("/{labtest_id}/uploadfile/")
def upload_file(labtest_id: int, file: UploadFile = File(...), session: Session = Depends(get_session)):
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    file_location = f"{UPLOAD_FOLDER}/{labtest_id}_{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # Gán đường dẫn file vào trường sample_file (bạn có thể đổi thành result_file tuỳ mục đích)
    lab_test = session.get(LabTest, labtest_id)
    if not lab_test:
        raise HTTPException(status_code=404, detail="LabTest not found")
    lab_test.sample_file = file_location
    session.add(lab_test)
    session.commit()
    session.refresh(lab_test)
    return {"file_path": file_location, "message": "Upload thành công"}
