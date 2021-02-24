from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Score, GameQuestion, HelperProfile

# Models to be shown on the Django admin page

admin.site.register(HelperProfile)
admin.site.register(Score)
admin.site.register(GameQuestion)
