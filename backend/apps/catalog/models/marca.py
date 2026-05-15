from django.db import models

from .base import SoftDeleteModel, TimestampedModel


class Marca(TimestampedModel, SoftDeleteModel):
    nome = models.CharField(max_length=100, unique=True, verbose_name="nome")
    slug = models.SlugField(max_length=120, unique=True, verbose_name="slug")

    class Meta:
        verbose_name = "marca"
        verbose_name_plural = "marcas"
        ordering = ["nome"]

    def __str__(self):
        return self.nome
