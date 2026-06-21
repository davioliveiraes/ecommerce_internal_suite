"""Popular o banco com lançamentos financeiros de demonstração.

Útil para mostrar o dashboard preenchido em ambiente de portfólio/demo.
"""

import random
from datetime import date, timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from finance.models import (
    CategoriaFinanceira,
    LancamentoFinanceiro,
    VisaoGeralPeriodo,
)


class Command(BaseCommand):
    help = "Popula o banco com lançamentos financeiros de exemplo para demo."

    def add_arguments(self, parser):
        parser.add_argument(
            "--meses",
            type=int,
            default=6,
            help="Quantos meses para trás gerar dados (padrão: 6).",
        )
        parser.add_argument(
            "--limpar",
            action="store_true",
            help="Apaga todos os lançamentos antes de popular.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        meses = options["meses"]
        limpar = options["limpar"]

        if limpar:
            removidos, _ = LancamentoFinanceiro.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Removidos {removidos} lançamentos."))
            removidos_vg, _ = VisaoGeralPeriodo.objects.all().delete()
            self.stdout.write(
                self.style.WARNING(f"Removidos {removidos_vg} períodos da visão geral.")
            )

        categorias = {c.slug: c for c in CategoriaFinanceira.objects.all()}
        slugs_necessarios = {
            "vendas-nuvemshop",
            "nuvemshop-plano",
            "hospedagem-dominio",
            "email-profissional",
            "equipe-ecommerce",
            "marketing-trafego",
            "taxas-meios-pagamento",
            "embalagens-frete",
        }
        faltantes = slugs_necessarios - set(categorias.keys())
        if faltantes:
            self.stdout.write(self.style.ERROR(
                f"Categorias ausentes no banco: {sorted(faltantes)}. "
                "Rode as migrations antes."
            ))
            return

        hoje = date.today()
        criados = 0
        periodos_vg = 0
        random.seed(42)

        for offset in range(meses):
            mes_referencia = (hoje.replace(day=1) - timedelta(days=offset * 30)).replace(day=1)

            criados += self._gerar_vendas_do_mes(mes_referencia, categorias)
            criados += self._gerar_despesas_fixas_do_mes(mes_referencia, categorias)
            criados += self._gerar_custos_variaveis_do_mes(mes_referencia, categorias)

        periodos_vg += self._gerar_visao_geral_operacao(hoje)

        self.stdout.write(self.style.SUCCESS(f"{criados} lançamentos criados."))
        self.stdout.write(
            self.style.SUCCESS(f"{periodos_vg} períodos de visão geral criados.")
        )

    def _gerar_vendas_do_mes(self, mes_referencia, categorias):
        cat = categorias["vendas-nuvemshop"]
        contagem = 0
        for _ in range(random.randint(8, 14)):
            dia = random.randint(1, 28)
            data = mes_referencia.replace(day=dia)
            valor = Decimal(str(round(random.uniform(80, 950), 2)))
            qtd_vendas = random.randint(1, 6)
            # Forma = como o cliente pagou. Meio = conta que recebe o dinheiro.
            # Toda venda da loja é recebida pela conta NuvemPago (NuvemShop).
            forma = random.choice(["PIX", "CARTAO_CREDITO", "BOLETO"])
            meio = "NUVEMPAGO"
            parcelas = random.choice([None, 1, 2, 3, 6, 12]) if forma == "CARTAO_CREDITO" else 1
            fonte = random.choice(["organico", "meta-ads", "google-ads", "instagram", "direto"])

            LancamentoFinanceiro.objects.create(
                descricao=f"Vendas NuvemShop — {data.strftime('%d/%m/%Y')}",
                tipo="RECEITA",
                categoria=cat,
                valor=valor * qtd_vendas,
                data_lancamento=data,
                status="PAGO",
                forma_pagamento=forma,
                meio_pagamento=meio,
                quantidade_parcelas=parcelas,
                quantidade_vendas=qtd_vendas,
                fonte_trafego=fonte,
            )
            contagem += 1
        return contagem

    def _gerar_despesas_fixas_do_mes(self, mes_referencia, categorias):
        fixos = [
            ("nuvemshop-plano", "Plano NuvemShop — mensalidade", "199.00", 5, "BOLETO"),
            ("hospedagem-dominio", "Hospedagem & domínio do site", "89.90", 7, "PIX"),
            ("email-profissional", "E-mail profissional", "34.90", 7, "CARTAO_CREDITO"),
            ("equipe-ecommerce", "Equipe ecommerce — salário", "3200.00", 5, "PIX"),
        ]
        contagem = 0
        for slug, descricao, valor, dia, forma in fixos:
            data = mes_referencia.replace(day=dia)
            status = "PAGO" if data <= date.today() else "PENDENTE"
            LancamentoFinanceiro.objects.create(
                descricao=descricao,
                tipo="DESPESA",
                categoria=categorias[slug],
                valor=Decimal(valor),
                data_lancamento=data,
                status=status,
                forma_pagamento=forma,
                meio_pagamento="MANUAL",
            )
            contagem += 1
        return contagem

    def _gerar_custos_variaveis_do_mes(self, mes_referencia, categorias):
        contagem = 0

        valor_marketing = Decimal(str(round(random.uniform(450, 1800), 2)))
        LancamentoFinanceiro.objects.create(
            descricao="Marketing & tráfego pago",
            tipo="DESPESA",
            categoria=categorias["marketing-trafego"],
            valor=valor_marketing,
            data_lancamento=mes_referencia.replace(day=random.randint(1, 28)),
            status="PAGO",
            forma_pagamento="CARTAO_CREDITO",
            meio_pagamento="MANUAL",
        )
        contagem += 1

        valor_taxas = Decimal(str(round(random.uniform(120, 480), 2)))
        LancamentoFinanceiro.objects.create(
            descricao="Taxas de meios de pagamento",
            tipo="DESPESA",
            categoria=categorias["taxas-meios-pagamento"],
            valor=valor_taxas,
            data_lancamento=mes_referencia.replace(day=28),
            status="PAGO",
            forma_pagamento="OUTRO",
            meio_pagamento="NUVEMPAGO",
        )
        contagem += 1

        for _ in range(random.randint(3, 6)):
            valor = Decimal(str(round(random.uniform(8, 45), 2)))
            qtd = random.randint(1, 5)
            data = mes_referencia.replace(day=random.randint(1, 28))
            LancamentoFinanceiro.objects.create(
                descricao=f"Embalagens & frete — pedido {data.strftime('%d/%m')}",
                tipo="CUSTO",
                categoria=categorias["embalagens-frete"],
                valor=valor * qtd,
                data_lancamento=data,
                status="PAGO",
                forma_pagamento="PIX",
                meio_pagamento="MANUAL",
                quantidade_vendas=qtd,
            )
            contagem += 1

        return contagem

    def _gerar_visao_geral_operacao(self, hoje):
        """Cria subperíodos da visão geral cobrindo a operação (início → hoje).

        Em vez de um único snapshot mensal, gera vários intervalos curtos a
        partir da data de início da operação. Assim o gráfico da Visão Geral
        mostra uma tendência (linha) que cresce conforme novos relatórios são
        registrados, e os totais do intervalo somam números realistas.
        """
        inicio_operacao = date(2026, 1, 1)
        if hoje < inicio_operacao:
            return 0

        passo_dias = 7
        contagem = 0
        d = inicio_operacao
        while d <= hoje:
            data_fim = min(d + timedelta(days=passo_dias - 1), hoje)

            visitas = random.randint(700, 1500)
            visualizacoes_categoria = int(visitas * random.uniform(0.38, 0.52))
            visualizacoes_produto = int(visitas * random.uniform(0.55, 0.72))
            carrinhos_criados = int(visitas * random.uniform(0.06, 0.11))
            checkout_iniciado = int(carrinhos_criados * random.uniform(0.55, 0.75))
            checkout_entrega = int(checkout_iniciado * random.uniform(0.78, 0.92))
            checkout_pagamento = int(checkout_entrega * random.uniform(0.80, 0.93))
            pedidos_criados = int(checkout_pagamento * random.uniform(0.82, 0.95))
            pedidos_pagos = max(1, int(pedidos_criados * random.uniform(0.88, 0.97)))
            ticket = Decimal(str(round(random.uniform(180, 320), 2)))
            receita = (ticket * pedidos_pagos).quantize(Decimal("0.01"))

            VisaoGeralPeriodo.objects.create(
                data_inicio=d,
                data_fim=data_fim,
                visitas=visitas,
                visualizacoes_categoria=visualizacoes_categoria,
                visualizacoes_produto=visualizacoes_produto,
                carrinhos_criados=carrinhos_criados,
                checkout_iniciado=checkout_iniciado,
                checkout_entrega=checkout_entrega,
                checkout_pagamento=checkout_pagamento,
                pedidos_criados=pedidos_criados,
                pedidos_pagos=pedidos_pagos,
                receita=receita,
                observacao="Relatório NuvemShop (demo).",
            )
            contagem += 1
            d = data_fim + timedelta(days=1)

        return contagem
