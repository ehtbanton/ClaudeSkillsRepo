from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime

router = APIRouter(prefix="/products", tags=["products"])

# Pydantic models
class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    price: float = Field(..., gt=0)
    quantity: int = Field(default=0, ge=0)
    is_active: bool = Field(default=True)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    price: Optional[float] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None

class ProductResponse(ProductBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PaginatedResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    page: int
    limit: int

# Endpoints
@router.get("/", response_model=PaginatedResponse)
async def list_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    is_active: Optional[bool] = None,
):
    """List all products with pagination."""
    # Implementation here
    return {"items": [], "total": 0, "page": page, "limit": limit}

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: UUID):
    """Get a product by ID."""
    # Implementation here
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(product: ProductCreate):
    """Create a new product."""
    # Implementation here
    pass

@router.patch("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: UUID, product: ProductUpdate):
    """Update a product."""
    # Implementation here
    pass

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(product_id: UUID):
    """Delete a product."""
    # Implementation here
    pass
