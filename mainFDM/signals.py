from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from .models import HelperProfile


# add signals to the Helper model so it gets updated whenever the django User model is
@receiver(post_save, sender=User)
def update_helper_profile(sender, instance, created, **kwargs):
    if created:
        HelperProfile.objects.create(user=instance)
