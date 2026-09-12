from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.payment import Payment
from app.models.user import User
from app.models.work_order import WorkOrder
from app.routes.auth import get_current_user
from app.schemas.payment import (
    PaymentCreate,
    PaymentResponse,
    PaymentUpdate,
)


router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


@router.post(
    "/",
    response_model=PaymentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_payment(
    payment_data: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    work_order = (
        db.query(WorkOrder)
        .filter(
            WorkOrder.id == payment_data.work_order_id,
            WorkOrder.user_id == current_user.id,
        )
        .first()
    )

    if not work_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ordem de serviço não encontrada.",
        )

    new_payment = Payment(
        valor=payment_data.valor,
        metodo=payment_data.metodo,
        status=payment_data.status,
        work_order_id=payment_data.work_order_id,
        user_id=current_user.id,
    )

    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)

    return new_payment

@router.get(
    "/",
    response_model=list[PaymentResponse],
)
def list_payments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payments = (
        db.query(Payment)
        .filter(Payment.user_id == current_user.id)
        .order_by(Payment.id.desc())
        .all()
    )

    return payments

@router.get(
    "/{payment_id}",
    response_model=PaymentResponse,
)
def get_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payment = (
        db.query(Payment)
        .filter(
            Payment.id == payment_id,
            Payment.user_id == current_user.id,
        )
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pagamento não encontrado.",
        )

    return payment

@router.put(
    "/{payment_id}",
    response_model=PaymentResponse,
)
def update_payment(
    payment_id: int,
    payment_data: PaymentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payment = (
        db.query(Payment)
        .filter(
            Payment.id == payment_id,
            Payment.user_id == current_user.id,
        )
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pagamento não encontrado.",
        )

    work_order = (
        db.query(WorkOrder)
        .filter(
            WorkOrder.id == payment_data.work_order_id,
            WorkOrder.user_id == current_user.id,
        )
        .first()
    )

    if not work_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ordem de serviço não encontrada.",
        )

    payment.valor = payment_data.valor
    payment.metodo = payment_data.metodo
    payment.status = payment_data.status
    payment.work_order_id = payment_data.work_order_id

    db.commit()
    db.refresh(payment)

    return payment

@router.delete(
    "/{payment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payment = (
        db.query(Payment)
        .filter(
            Payment.id == payment_id,
            Payment.user_id == current_user.id,
        )
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pagamento não encontrado.",
        )

    db.delete(payment)
    db.commit()