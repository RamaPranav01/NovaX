from pydantic import BaseModel, EmailStr

# Shared properties
class UserBase(BaseModel):
    email: EmailStr

# Properties to receive on user creation
class UserCreate(UserBase):
    password: str

# Properties to receive on user update
class UserUpdate(BaseModel):
    pass # We'll leave this for later

# Properties stored in DB
class UserInDB(UserBase):
    id: int
    hashed_password: str
    is_active: bool

    class Config:
        from_attributes = True

# Properties to return to client (sensitive data removed)
class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True