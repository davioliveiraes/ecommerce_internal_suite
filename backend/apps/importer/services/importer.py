"""Lógica principal de importação."""

from pathlib import Path

from django.db import transaction
from rich.console import Console

from catalog.models import Produto, Variacao

from .parsers import parse_decimal, parse_sku, parse_status, parse_string
from .planilha_reader import ler_planilha
from .report import RelatorioImport


class ImportadorPlanilha:
    def __init__(self, caminho: Path, console: Console, dry_run: bool = False):
        self.caminho = caminho
        self.console = console
        self.dry_run = dry_run
        self.relatorio = RelatorioImport(dry_run=dry_run)

    def executar(self) -> RelatorioImport:
        with transaction.atomic():
            for linha in ler_planilha(self.caminho):
                self.relatorio.total_linhas += 1
                self._processar_linha(linha)
            if self.dry_run:
                self.console.print("[yellow]Dry-run: fazendo rollback...[/yellow]")
                transaction.set_rollback(True)
        return self.relatorio

    def _processar_linha(self, linha: dict):
        linha_excel = linha["linha_excel"]
        sku = parse_sku(linha["sku_nuvemshop"])
        descricao_site = parse_string(linha["descricao_produto_site"])

        if not descricao_site:
            self.relatorio.registrar_erro(linha_excel, sku, "", "Descrição do site vazia")
            return

        descricao_gestaoclick = (
            parse_string(linha["descricao_produto_gestaoclick"]) or descricao_site
        )
        descricao_variacao = parse_string(linha["descricao_variacao"])

        try:
            custo = parse_decimal(linha["custo"])
            if custo is None:
                raise ValueError("custo vazio")
        except ValueError as e:
            self.relatorio.registrar_erro(linha_excel, sku, descricao_site, f"Custo inválido: {e}")
            return

        try:
            preco_loja = parse_decimal(linha["preco_loja"])
            if preco_loja is None:
                raise ValueError("preço de loja vazio")
        except ValueError as e:
            self.relatorio.registrar_erro(linha_excel, sku, descricao_site, f"Preço de loja inválido: {e}")
            return

        try:
            preco_site = parse_decimal(linha["preco_site"])
        except ValueError:
            preco_site = None

        produto, criado = Produto.objects.update_or_create(
            descricao_produto_site=descricao_site,
            defaults={
                "descricao_produto_gestaoclick": descricao_gestaoclick,
            },
        )
        if criado:
            self.relatorio.produtos_criados += 1

        defaults = {
            "produto": produto,
            "id_gestaoclick": sku,
            "descricao": descricao_variacao,
            "custo": custo,
            "preco_loja": preco_loja,
            "preco_site": preco_site,
            "status_nuvemshop": parse_status(linha["status_nuvemshop"]),
            "status_integracao": parse_status(linha["status_integracao"]),
            "ativo": True,
        }

        if sku:
            _, variacao_criada = Variacao.objects.update_or_create(
                sku_nuvemshop=sku,
                defaults=defaults,
            )
        else:
            defaults["sku_nuvemshop"] = ""
            _, variacao_criada = Variacao.objects.update_or_create(
                produto=produto,
                descricao=descricao_variacao,
                sku_nuvemshop="",
                defaults=defaults,
            )

        if variacao_criada:
            self.relatorio.variacoes_criadas += 1
        else:
            self.relatorio.variacoes_atualizadas += 1
