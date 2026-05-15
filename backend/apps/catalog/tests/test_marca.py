from django.test import TestCase
from catalog.models import Marca


class MarcaTestCase(TestCase):
    def test_criar(self):
        marca = Marca.objects.create(nome="GET", slug="get")
        self.assertEqual(str(marca), "GET")
        self.assertTrue(marca.ativo)

    def test_soft_delete(self):
        marca = Marca.objects.create(nome="HREBOS", slug="hrebos")
        marca.delete()
        marca.refresh_from_db()
        self.assertFalse(marca.ativo)
        self.assertEqual(Marca.objects.count(), 1)

    def test_hard_delete(self):
        marca = Marca.objects.create(nome="PMCELL", slug="pmcell")
        marca.delete(hard=True)
        self.assertEqual(Marca.objects.count(), 0)
