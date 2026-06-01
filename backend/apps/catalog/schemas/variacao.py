from datetime import datetime
from decimal import Decimal
from typing import Optional

from ninja import Schema


class VariacaoIn(Schema):
    produto_id: int
    sku_nuvemshop: str = ""
    id_gestaoclick: str = ""
    codigo_barras: str = ""
    descricao: str = ""
    custo: Decimal
    preco_loja: Decimal
    preco_site: Optional[Decimal] = None
    preco_promocional: Optional[Decimal] = None
    status_nuvemshop: str = "ATIVO"
    status_integracao: str = "ATIVO"


class VariacaoOut(Schema):
    id: int
    produto_id: int
    produto_nome_site: str
    produto_nome_gestaoclick: str
    produto_descricao_site: str
    produto_descricao_gestaoclick: str
    sku_nuvemshop: str
    id_gestaoclick: str
    codigo_barras: str
    descricao: str
    custo: Decimal
    preco_loja: Decimal
    preco_site: Optional[Decimal] = None
    margem_percentual: Optional[Decimal] = None
    preco_promocional: Optional[Decimal] = None
    margem_promocional_percentual: Optional[Decimal] = None
    status_nuvemshop: str
    status_integracao: str
    ativo: bool
    criado_em: datetime
    atualizado_em: datetime

    @staticmethod
    def resolve_produto_nome_site(obj) -> str:
        return obj.produto.nome_site

    @staticmethod
    def resolve_produto_nome_gestaoclick(obj) -> str:
        return obj.produto.nome_gestaoclick

    @staticmethod
    def resolve_produto_descricao_site(obj) -> str:
        return obj.produto.descricao_produto_site

    @staticmethod
    def resolve_produto_descricao_gestaoclick(obj) -> str:
        return obj.produto.descricao_produto_gestaoclick

    @staticmethod
    def resolve_margem_percentual(obj) -> Optional[Decimal]:
        m = obj.margem_percentual
        if m is None:
            return None
        return m.quantize(Decimal("0.01"))

    @staticmethod
    def resolve_margem_promocional_percentual(obj) -> Optional[Decimal]:
        m = obj.margem_promocional_percentual
        if m is None:
            return None
        return m.quantize(Decimal("0.01"))


class VariacaoPatch(Schema):
    sku_nuvemshop: Optional[str] = None
    id_gestaoclick: Optional[str] = None
    codigo_barras: Optional[str] = None
    descricao: Optional[str] = None
    custo: Optional[Decimal] = None
    preco_loja: Optional[Decimal] = None
    preco_site: Optional[Decimal] = None
    preco_promocional: Optional[Decimal] = None
    status_nuvemshop: Optional[str] = None
    status_integracao: Optional[str] = None
    ativo: Optional[bool] = None
