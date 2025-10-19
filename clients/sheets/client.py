import datetime

import gspread
from google.oauth2.service_account import Credentials
from django.conf import settings

from clients.sheets.dto import NewProductData


class SpreadsheetClient:
    def __init__(self, ):
        self.service_account_file = settings.SERVICE_ACCOUNT_FILE
        scopes = ['https://www.googleapis.com/auth/spreadsheets']
        credentials = Credentials.from_service_account_file(self.service_account_file, scopes=scopes)
        self.client = gspread.authorize(credentials)
        self._init_spreadsheets_id()

    def _init_spreadsheets_id(self):
        self.product_id = settings.SPREADSHEET_PRODUCT_ID

    def create_product_row(self, data: NewProductData):
        sheet = self.client.open_by_key(self.product_id).worksheet("Лист 1")
        sheet.append_row(
            [
                f'{datetime.datetime.now()}',
                f'{data.source}',
                f'{data.age}',
                f'{data.subscription_info}',
                f'{data.health_satisfaction}',
                f'{data.health_issues}',
                f'{data.subscribed_doctors}',
                f'{data.income}',
                f'{data.bought_products}',
                f'{data.products_details}',
                f'{data.full_name}',
                f'{data.city}',
                f'{data.phone}',
                f'{data.telegram}',
                f'{data.policy_agreement}',
                f'{data.has_bought_products}'
            ]
        )
