from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django.conf.urls.static import static

from django.conf import settings

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/auth/", include("apps.acounts.urls")),

    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/projects/", include("apps.projects.urls")),
    path("api/intelligence/", include("apps.intelligence.urls")),
    path("api/semantic/", include("apps.semantic.urls")),
    path("api/ai/", include("apps.ai.urls")),
    path("api/dashboard/", include("apps.dashboard.urls")),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)    