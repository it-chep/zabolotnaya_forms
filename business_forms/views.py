import os

from django.contrib.contenttypes.models import ContentType
from django.http import JsonResponse

from django.shortcuts import render
from django.urls import reverse
from django.views.generic import TemplateView
from django.conf import settings

from business_forms.forms import NewProductForm
from business_forms.models import BusinessForm, NewProduct
from business_forms.utils import get_site_url
from clients.sheets.dto import NewProductData


def health_check(request):
    return JsonResponse({"status": "ok"}, status=200)


class NewProductView(TemplateView):
    template_name = 'business_forms/new_product_form.html'
    form_class = NewProductForm
    client = settings.SPREADSHEET_CLIENT
    notification_client = settings.TELEGRAM_BOT_CLIENT

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        content_type = ContentType.objects.get_for_model(NewProduct)
        context["business_form_settings"] = BusinessForm.objects.filter(content_type=content_type).first()
        context["medblogers_form"] = self.form_class()
        return context

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()
        return render(request, self.template_name, context)

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        result = {"success": False}

        if form.is_valid():
            instance = form.save()
            data = {
                "full_name": instance.full_name,
                "age": instance.age,
                "city": instance.city,
            }

            self.notification_client.send_new_product_notification(data, [os.getenv("NOTIFICATION_CHAT_ID")])
            self.client.create_product_row(NewProductData.from_model(instance))
            result.update({"success": True, "redirect_url": get_site_url() + reverse("spasibo_new_product")})
        else:
            result.update({"errors": form.errors})

        return JsonResponse(result)


class SpasiboNewProductView(TemplateView):
    template_name = 'business_forms/spasibo_new_product_form.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        content_type = ContentType.objects.get_for_model(NewProduct)
        context["business_form_settings"] = BusinessForm.objects.filter(content_type=content_type).first()
        return context

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()
        return render(request, self.template_name, context)
