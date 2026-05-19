from decimal import Decimal
from django.db import models

from .base import SoftDeleteModel, TimestampedModel


class StatusNuvemshop(models.TextChoices):
    ATIVO = "ATIVO", "Ativo"
    INATIVO = "INATIVO", "Inativo"


class StatusIntegracao(models.TextChoices):
    ATIVO = "ATIVO", "Ativo"
    INATIVO = "INATIVO", "Inativo"


class Variacao(TimestampedModel, SoftDeleteModel):
    produto = models.ForeignKey(
        "catalog.Produto",
        on_delete=models.CASCADE,
        related_name="variacoes",
        verbose_name="produto",
    )
    sku_nuvemshop = models.CharField(
        max_length=50,
        blank=True,
        default="",
        verbose_name="SKU Nuvemshop",
    )
    id_gestaoclick = models.CharField(
        max_length=50,
        blank=True,
        default="",
        verbose_name="ID GestãoClick",
    )
    codigo_barras = models.CharField(
        max_length=50,
        blank=True,
        default="",
        verbose_name="código de barras",
    )
    descricao = models.CharField(
        max_length=500,
        blank=True,
        default="",
        verbose_name="descrição da variação",
        help_text="Ex: USB-C, Lightning, Preto, 128GB.",
    )
    custo = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="custo",
    )
    preco_loja = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="preço loja",
    )
    preco_site = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="preço site",
    )
    status_nuvemshop = models.CharField(
        max_length=10,
        choices=StatusNuvemshop.choices,
        default=StatusNuvemshop.ATIVO,
        verbose_name="status Nuvemshop",
    )
    status_integracao = models.CharField(
        max_length=10,
        choices=StatusIntegracao.choices,
        default=StatusIntegracao.ATIVO,
        verbose_name="status integração GestãoClick ↔ Nuvemshop",
    )

    class Meta:
        verbose_name = "variação"
        verbose_name_plural = "variações"
        ordering = ["produto__descricao_produto_site", "descricao"]

    def __str__(self):
        desc = self.descricao or "padrão"
        return f"{self.produto} — {desc}"

    @property
    def margem(self) -> Decimal | None:
        if self.preco_site is None or self.custo == 0:
            return None
        return (self.preco_site - self.custo) / self.custo

    @property
    def margem_percentual(self) -> Decimal | None:
        if self.margem is None:
            return None
        return self.margem * 100
