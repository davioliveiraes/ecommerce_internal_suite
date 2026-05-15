from django.test import TestCase
from catalog.models import Categoria


class CategoriaTestCase(TestCase):
    def test_criar(self):
        cat = Categoria.objects.create(nome="Fones", slug="fones")
        self.assertEqual(str(cat), "Fones")
        self.assertTrue(cat.ativo)
