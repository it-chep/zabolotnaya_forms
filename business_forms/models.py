import os
import re

from django.db import models

from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import SuspiciousFileOperation


def safe_filename(filename):
    filename = re.sub(r'[^\w\s.-]', '', filename).strip()
    if '..' in filename or filename.startswith('/'):
        raise SuspiciousFileOperation("Detected path traversal attempt")
    return filename


class BusinessForm(models.Model):
    def get_upload_photo_path(self, filename):
        filename = safe_filename(filename)
        return os.path.join('banners', filename)

    def get_upload_spasibo_path(self, filename):
        filename = safe_filename(filename)
        return os.path.join('spasibo', filename)

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    photo = models.ImageField(upload_to=get_upload_photo_path)
    spasibo_photo = models.ImageField(upload_to=get_upload_spasibo_path)

    content_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Конфигурации форм"
        verbose_name_plural = "Конфигурации форм"

class NewProduct(models.Model):

    SOURCE_CHOICES = [
        ('telegram', 'Телеграм'),
        ('instagram', 'Инстаграм (запрещен в РФ)'),
        ('bot_mailing', 'Рассылка в боте'),
        ('email_mailing', 'Рассылка по почте'),
        ('vk', "ВКонтакте")
    ]
    source = models.CharField(
        max_length=20,
        choices=SOURCE_CHOICES,
        verbose_name='Вы увидели эту анкету у меня в'
    )

    AGE_CHOICES = [
        ('18-29', '18-29'),
        ('30-39', '30-39'),
        ('40-49', '40-49'),
        ('50-59', '50-59'),
        ('60-69', '60-69'),
        ('70-79', '70-79'),
        ('80-89', '80-89'),
    ]
    age = models.CharField(
        max_length=5,
        choices=AGE_CHOICES,
        verbose_name='Ваш возраст'
    )

    subscription_info = models.TextField(
        verbose_name='Как давно вы на меня подписаны и откуда про меня узнали?'
    )

    HEALTH_SATISFACTION_CHOICES = [
        ('no', 'Нет'),
        ('yes', 'Да'),
        ('not_sure', 'Затрудняюсь ответить'),
    ]
    health_satisfaction = models.CharField(
        max_length=10,
        choices=HEALTH_SATISFACTION_CHOICES,
        verbose_name='Довольны ли вы текущим состоянием ваше здоровья?'
    )

    health_issues = models.TextField(
        verbose_name='ТОП-3 вопроса по здоровью, которые вы бы хотели решить/улучшить?'
    )

    subscribed_doctors = models.TextField(
        verbose_name='На кого из докторов вы подписаны в телеграм? (можно просто написать название канала или вставить ссылки)'
    )

    INCOME_CHOICES = [
        ('50k', 'до 50 тысяч'),
        ('100k', 'до 100 тысяч'),
        ('150k', 'до 150 тысяч'),
        ('200k', 'до 200 тысяч'),
        ('300k', 'до 300 тысяч'),
        ('300k_plus', 'выше 300 тысяч'),
    ]
    income = models.CharField(
        max_length=10,
        choices=INCOME_CHOICES,
        verbose_name='Ваш средний доход в месяц?'
    )

    BOUGHT_PRODUCTS_CHOICES = [
        ('yes', 'Да'),
        ('no', 'Нет'),
    ]
    bought_products = models.CharField(
        max_length=3,
        choices=BOUGHT_PRODUCTS_CHOICES,
        verbose_name='Покупали ли вы какие-то образовательные продукты у докторов в соцсетях (НЕ консультации)?'
    )

    products_details = models.TextField(
        blank=True,
        verbose_name='Если да, то расскажите какие, у кого и за какую стоимость?'
    )

    full_name = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='Ваше Имя и Фамилия'
    )

    city = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Город проживания'
    )

    phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name='Ваш номер телефона?'
    )

    telegram = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Ссылка на ваш личный телеграм (не канал) в формате https://t.me/abaymukanov или через @'
    )

    policy_agreement = models.BooleanField(
        default=False,
        verbose_name='Даю согласие на обработку персональных данных'
    )

    # Дополнительные поля
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Анкета нового продукта'
        verbose_name_plural = 'Анкеты нового продукта'

    def __str__(self):
        return f"Анкета от {self.full_name or 'аноним'}"
