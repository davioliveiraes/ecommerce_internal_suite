from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from ninja import Schema


class VisaoGeralPeriodoIn(Schema):
    data_inicio: date
    data_fim: date
    visitas: int = 0
    visualizacoes_categoria: int = 0
    visualizacoes_produto: int = 0
    carrinhos_criados: int = 0
    checkout_iniciado: int = 0
    checkout_entrega: int = 0
    checkout_pagamento: int = 0
    pedidos_criados: int = 0
    pedidos_pagos: int = 0
    receita: Decimal = Decimal("0")
    observacao: str = ""


class VisaoGeralPeriodoOut(Schema):
    id: int
    data_inicio: date
    data_fim: date
    visitas: int
    visualizacoes_categoria: int
    visualizacoes_produto: int
    carrinhos_criados: int
    checkout_iniciado: int
    checkout_entrega: int
    checkout_pagamento: int
    pedidos_criados: int
    pedidos_pagos: int
    receita: Decimal
    observacao: str
    vendas: int
    ticket_medio: Decimal
    conversao_visitas_vendas: Decimal
    conversao_visitas_carrinhos: Decimal
    conversao_checkouts_vendas: Decimal
    label_periodo: str
    criado_em: datetime
    atualizado_em: datetime

    @staticmethod
    def resolve_label_periodo(obj) -> str:
        return (
            f"{obj.data_inicio.strftime('%d/%m/%y')} – "
            f"{obj.data_fim.strftime('%d/%m/%y')}"
        )


class VisaoGeralPeriodoPatch(Schema):
    data_inicio: Optional[date] = None
    data_fim: Optional[date] = None
    visitas: Optional[int] = None
    visualizacoes_categoria: Optional[int] = None
    visualizacoes_produto: Optional[int] = None
    carrinhos_criados: Optional[int] = None
    checkout_iniciado: Optional[int] = None
    checkout_entrega: Optional[int] = None
    checkout_pagamento: Optional[int] = None
    pedidos_criados: Optional[int] = None
    pedidos_pagos: Optional[int] = None
    receita: Optional[Decimal] = None
    observacao: Optional[str] = None
