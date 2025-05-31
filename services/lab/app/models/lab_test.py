from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

class LabTestBase(SQLModel):
    order_id: int
    test_code: str
    request_from: str
    sample_name: str
    formula_code: Optional[str] = None
    test_purpose: Optional[str] = None
    test_standard: Optional[str] = None
    request_date: datetime
    sample_file: Optional[str] = None
    result_summary: Optional[str] = None
    result_file: Optional[str] = None
    pass_status: Optional[str] = None
    note: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class LabTest(LabTestBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class LabTestCreate(LabTestBase):
    pass

class LabTestRead(LabTestBase):
    id: int

class LabTestUpdate(SQLModel):
    test_code: Optional[str] = None
    request_from: Optional[str] = None
    sample_name: Optional[str] = None
    # ... các trường khác tương tự
    updated_at: Optional[datetime] = None
