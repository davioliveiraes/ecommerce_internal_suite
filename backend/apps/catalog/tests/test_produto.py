from django.test import TestCase
from catalog.models import Marca, Categoria, Subcategoria, Produto


class ProdutoTestCase(TestCase):
    def setUp(self):
        self.marca = Marca.objects.create(nome="GET", slug="get")
        self.categoria = Categoria.objects.create(nome="Fones", slug="fones")
        self.subcategoria = Subcategoria.objects.create(
            nome="TWS", slug="tws", categoria=self.categoria,
        )

    def test_criar(self):
        produto = Produto.objects.create(
            nome_gestaoclick="FONE GET BUDS LITE",
            nome_site="FONE DE OUVIDO TWS BLUETOOTH BUDS LITE GET",
            marca=self.marca,
            subcategoria=self.subcategoria,
        )
        self.assertEqual(str(produto), "FONE DE OUVIDO TWS BLUETOOTH BUDS LITE GET")

    def test_sem_marca_e_subcategoria(self):
        produto = Produto.objects.create(
            nome_gestaoclick="TESTE",
            nome_site="TESTE PRODUTO",
        )
        self.assertIsNone(produto.marca)
        self.assertIsNone(produto.subcategoria)
