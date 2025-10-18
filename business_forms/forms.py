from django import forms
from .models import NewProduct


class NewProductForm(forms.ModelForm):
    """Форма нового продукта"""

    class Meta:
        model = NewProduct
        fields = (
            'source',
            'age',
            'subscription_info',
            'health_satisfaction',
            'health_issues',
            'subscribed_doctors',
            'income',
            'bought_products',
            'products_details',
            'full_name',
            'city',
            'phone',
            'telegram',
            'policy_agreement',
        )
        widgets = {
            'source': forms.RadioSelect,
            'age': forms.RadioSelect,
            'subscription_info': forms.TextInput(attrs={
                'placeholder': 'Мой ответ'
            }),
            'health_satisfaction': forms.RadioSelect,
            'health_issues': forms.TextInput(attrs={
                'placeholder': 'Мой ответ'
            }),
            'subscribed_doctors': forms.TextInput(attrs={
                'placeholder': 'Мой ответ'
            }),
            'income': forms.RadioSelect,
            'bought_products': forms.RadioSelect,
            'products_details': forms.TextInput(attrs={
                'placeholder': 'Мой ответ'
            }),
            'full_name': forms.TextInput(attrs={
                'placeholder': 'Мой ответ'
            }),
            'city': forms.TextInput(attrs={
                'placeholder': 'Мой ответ'
            }),
            'phone': forms.TextInput(attrs={
                'placeholder': '+7 (999) 999-99-99'
            }),
            'telegram': forms.TextInput(attrs={
                'placeholder': 'https://t.me/username или @username'
            }),
            'policy_agreement': forms.CheckboxInput(attrs={'style': 'display:none'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            if field_name in ['products_details', "full_name", "city", "phone", "telegram"]:
                continue
            field.required = True

        self.fields['income'].error_messages.update({
            'required': 'Обязательное поле'
        })

        self.fields['bought_products'].error_messages.update({
            'required': 'Обязательное поле'
        })

        self.fields['health_satisfaction'].error_messages.update({
            'required': 'Обязательное поле'
        })

        self.fields['source'].error_messages.update({
            'required': 'Обязательное поле'
        })

        self.fields['age'].error_messages.update({
            'required': 'Обязательное поле'
        })

        self.fields['income'].choices = list(NewProduct.INCOME_CHOICES)
        self.fields['bought_products'].choices = list(NewProduct.BOUGHT_PRODUCTS_CHOICES)
        self.fields['health_satisfaction'].choices = list(NewProduct.HEALTH_SATISFACTION_CHOICES)
        self.fields['source'].choices = list(NewProduct.SOURCE_CHOICES)
        self.fields['age'].choices = list(NewProduct.AGE_CHOICES)
