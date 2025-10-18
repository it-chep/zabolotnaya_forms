from django.contrib import admin
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Group

from business_forms.models import BusinessForm, NewProduct


class BusinessFormAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    list_filter = ('content_type',)

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        form.base_fields['content_type'].queryset = ContentType.objects.filter(
            model__in=['medblogerspreentry', 'nastavnichestvopreentry', 'nationalblogersassociation',
                       'expressmedbloger', 'neuromedbloger']
        )
        return form


class NewProductAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


admin.site.register(BusinessForm, BusinessFormAdmin)
admin.site.register(NewProduct, NewProductAdmin)

admin.site.unregister(Group)
