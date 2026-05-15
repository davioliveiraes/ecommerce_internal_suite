from django.db import models

from .base import SoftDeleteModel, TimestampedModel


class Produto(TimestampedModel, SoftDeleteModel):
    nome_gestaoclick = models.CharField(
        max_length=255,
        verbose_name="nome (GestãoClick)",
        help_text="Descrição usada no sistema GestãoClick.",
    )
    nome_site = models.CharField(
        max_length=255,
        verbose_name="nome (site)",
        help_text="Descrição usada no site Nuvemshop.",
    )
    marca = models.ForeignKey(
        "catalog.Marca",
        on_delete=models.PROTECT,
        related_name="produtos",
        null=True,
        blank=True,
        verbose_name="marca",
    )
    subcategoria = models.ForeignKey(
        "catalog.Subcategoria",
        on_delete=models.PROTECT,
        related_name="produtos",
        null=True,
        blank=True,
        verbose_name="subcategoria",
    )

    class Meta:
        verbose_name = "produto"
        verbose_name_plural = "produtos"
        ordering = ["nome_site"]

    def __str__(self):
        return self.nome_site
