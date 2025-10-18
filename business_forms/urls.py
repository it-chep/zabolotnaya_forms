from django.urls import path

from business_forms.views import NewProductView, SpasiboNewProductView

urlpatterns = [

    path("spasibo/", SpasiboNewProductView.as_view(), name="spasibo_new_product"),
    path("", NewProductView.as_view(), name="new_product"),
]
