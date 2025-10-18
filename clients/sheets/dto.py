from dataclasses import dataclass
from typing import Optional, Literal


@dataclass
class NewProductData:
    source: Optional[Literal["telegram", "instagram", "bot_mailing", "email_mailing"]] = None
    age: Optional[Literal["18-29", "30-39", "40-49", "50-59", "60-69", "70-79", "80-89"]] = None
    subscription_info: Optional[str] = None
    health_satisfaction: Optional[Literal["no", "yes", "not_sure"]] = None
    health_issues: Optional[str] = None
    subscribed_doctors: Optional[str] = None
    income: Optional[Literal["50k", "100k", "150k", "200k", "300k", "300k_plus"]] = None
    bought_products: Optional[Literal["yes", "no"]] = None
    products_details: Optional[str] = None
    full_name: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    telegram: Optional[str] = None
    policy_agreement: bool = False

    @classmethod
    def from_model(cls, model_instance) -> "NewProductData":
        """Создает датакласс из экземпляра модели Django NewProduct"""
        return cls(
            source=model_instance.get_source_display(),
            age=model_instance.get_age_display(),
            subscription_info=model_instance.subscription_info,
            health_satisfaction=model_instance.get_health_satisfaction_display(),
            health_issues=model_instance.health_issues,
            subscribed_doctors=model_instance.subscribed_doctors,
            income=model_instance.get_income_display(),
            bought_products=model_instance.get_bought_products_display(),
            products_details=model_instance.products_details,
            full_name=model_instance.full_name,
            city=model_instance.city,
            phone=model_instance.phone,
            telegram=model_instance.telegram,
            policy_agreement=model_instance.policy_agreement,
        )
