from django.db import models

from .base import SoftDeleteModel, TimestampedModel


class Categoria(TimestampedModel, SoftDeleteModel):
    nome = models.CharField(max_length=100, unique=True, verbose_name="nome")
    slug = models.SlugField(max_length=120, unique=True, verbose_name="slug")
    descricao = models.TextField(blank=True, default="", verbose_name="descrição")

    class Meta:
        verbose_name = "categoria"
        verbose_name_plural = "categorias"
        ordering = ["nome"]

    def __str__(self):
        return self.nome
