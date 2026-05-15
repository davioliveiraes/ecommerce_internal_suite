from django.db import models


class TimestampedModel(models.Model):
    criado_em = models.DateTimeField(auto_now_add=True, verbose_name="criado em")
    atualizado_em = models.DateTimeField(auto_now=True, verbose_name="atualizado em")

    class Meta:
        abstract = True


class SoftDeleteModel(models.Model):
    ativo = models.BooleanField(default=True, verbose_name="ativo")

    class Meta:
        abstract = True

    def delete(self, using=None, keep_parents=False, hard=False):
        if hard:
            return super().delete(using=using, keep_parents=keep_parents)
        self.ativo = False
        self.save(update_fields=["ativo"])
