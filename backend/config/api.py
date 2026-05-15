from ninja import NinjaAPI

api = NinjaAPI(
    title="Ibeize Ecommerce Control API",
    version="1.0.0",
    description="API interna para gerenciamento de catálogo e finanças.",
)


@api.get("/health", tags=["meta"])
def health(request):
    return {"status": "ok"}
