from django.conf import settings
from django.contrib import admin
from django.urls import path

from .api import api

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
]

if settings.DEBUG:
    from django.urls import include
    urlpatterns += [path("__debug__/", include("debug_toolbar.urls"))]
