from django.urls import path
from . import views

# get the view for the quiz app
urlpatterns = [
    path('', views.index, name='index')
]
