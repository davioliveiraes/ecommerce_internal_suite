from django.test import TestCase
from catalog.models import Categoria, Subcategoria


class SubcategoriaTestCase(TestCase):
    def setUp(self):
        self.categoria = Categoria.objects.create(nome="Fones", slug="fones")

    def test_criar(self):
        sub = Subcategoria.objects.create(
            nome="TWS", slug="tws", categoria=self.categoria,
        )
        self.assertEqual(str(sub), "Fones > TWS")

    def test_mesmo_nome_em_categorias_diferentes(self):
        cabos = Categoria.objects.create(nome="Cabos", slug="cabos")
        Subcategoria.objects.create(nome="USB-C", slug="usb-c", categoria=self.categoria)
        Subcategoria.objects.create(nome="USB-C", slug="usb-c", categoria=cabos)
