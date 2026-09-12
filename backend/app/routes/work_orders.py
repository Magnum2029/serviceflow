from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.client import Client
from app.models.user import User
from app.models.work_order import WorkOrder
from app.routes.auth import get_current_user
from app.schemas.work_order import (
    WorkOrderCreate,
    WorkOrderResponse,
    WorkOrderUpdate,
)


router = APIRouter(
    prefix="/work-orders",
    tags=["Work Orders"],
)

@router.post(
    "/",
    response_model=WorkOrderResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_work_order(
    work_order_data: WorkOrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    client = (
        db.query(Client)
        .filter(
            Client.id == work_order_data.client_id,
            Client.user_id == current_user.id,
        )
        .first()
    )

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado.",
        )

    new_work_order = WorkOrder(
        titulo=work_order_data.titulo,
        descricao=work_order_data.descricao,
        status=work_order_data.status,
        valor=work_order_data.valor,
        client_id=work_order_data.client_id,
        user_id=current_user.id,
    )

    db.add(new_work_order)
    db.commit()
    db.refresh(new_work_order)

    return new_work_order

@router.get(
    "/",
    response_model=list[WorkOrderResponse],
)
def list_work_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    work_orders = (
        db.query(WorkOrder)
        .filter(WorkOrder.user_id == current_user.id)
        .order_by(WorkOrder.id.desc())
        .all()
    )

    return work_orders

@router.get(
    "/{work_order_id}",
    response_model=WorkOrderResponse,
)
def get_work_order(
    work_order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    work_order = (
        db.query(WorkOrder)
        .filter(
            WorkOrder.id == work_order_id,
            WorkOrder.user_id == current_user.id,
        )
        .first()
    )

    if not work_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ordem de serviço não encontrada.",
        )

    return work_order

@router.put(
    "/{work_order_id}",
    response_model=WorkOrderResponse,
)
def update_work_order(
    work_order_id: int,
    work_order_data: WorkOrderUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    work_order = (
        db.query(WorkOrder)
        .filter(
            WorkOrder.id == work_order_id,
            WorkOrder.user_id == current_user.id,
        )
        .first()
    )

    if not work_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ordem de serviço não encontrada.",
        )

    client = (
        db.query(Client)
        .filter(
            Client.id == work_order_data.client_id,
            Client.user_id == current_user.id,
        )
        .first()
    )

    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cliente não encontrado.",
        )

    work_order.titulo = work_order_data.titulo
    work_order.descricao = work_order_data.descricao
    work_order.status = work_order_data.status
    work_order.valor = work_order_data.valor
    work_order.client_id = work_order_data.client_id

    db.commit()
    db.refresh(work_order)

    return work_order

@router.delete(
    "/{work_order_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_work_order(
    work_order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    work_order = (
        db.query(WorkOrder)
        .filter(
            WorkOrder.id == work_order_id,
            WorkOrder.user_id == current_user.id,
        )
        .first()
    )

    if not work_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ordem de serviço não encontrada.",
        )

    db.delete(work_order)
    db.commit()