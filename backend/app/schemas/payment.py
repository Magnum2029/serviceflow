from pydantic import BaseModel


class PaymentCreate(BaseModel):
    valor: float
    metodo: str
    status: str = "pendente"
    work_order_id: int
    
class PaymentUpdate(BaseModel):
    valor: float
    metodo: str
    status: str
    work_order_id: int    


class PaymentResponse(BaseModel):
    id: int
    valor: float
    metodo: str
    status: str
    work_order_id: int
    user_id: int

    model_config = {
        "from_attributes": True
    }