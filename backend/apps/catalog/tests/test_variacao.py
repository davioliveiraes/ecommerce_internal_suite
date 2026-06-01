from decimal import Decimal
from django.test import TestCase
from catalog.models import Produto, Variacao


class VariacaoTestCase(TestCase):
    def setUp(self):
        self.produto = Produto.objects.create(
            nome_gestaoclick="FONE SKAIKY",
            nome_site="FONE DE OUVIDO COM FIO SKAIKY",
        )

    def test_criar(self):
        v = Variacao.objects.create(
            produto=self.produto,
            sku_nuvemshop="20559530469000001",
            descricao="USB-C",
            custo=Decimal("14.33"),
            preco_loja=Decimal("69.90"),
            preco_site=Decimal("49.90"),
        )
        self.assertIn("USB-C", str(v))
        self.assertEqual(v.custo, Decimal("14.33"))

    def test_margem(self):
        v = Variacao.objects.create(
            produto=self.produto,
            sku_nuvemshop="SKU-001",
            custo=Decimal("10.00"),
            preco_loja=Decimal("20.00"),
            preco_site=Decimal("25.00"),
        )
        self.assertEqual(v.margem, Decimal("1.5"))
        self.assertEqual(v.margem_percentual, Decimal("150.0"))

    def test_margem_sem_preco_site(self):
        v = Variacao.objects.create(
            produto=self.produto,
            sku_nuvemshop="SKU-002",
            custo=Decimal("10.00"),
            preco_loja=Decimal("20.00"),
            preco_site=None,
        )
        self.assertIsNone(v.margem)

    def test_margem_promocional(self):
        v = Variacao.objects.create(
            produto=self.produto,
            sku_nuvemshop="SKU-PROMO",
            custo=Decimal("10.00"),
            preco_loja=Decimal("20.00"),
            preco_site=Decimal("25.00"),
            preco_promocional=Decimal("18.00"),
        )
        self.assertEqual(v.margem_promocional, Decimal("0.8"))
        self.assertEqual(v.margem_promocional_percentual, Decimal("80.0"))
