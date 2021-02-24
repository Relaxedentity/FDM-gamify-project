from django.conf.urls import url
from cable_app import views

urlpatterns = [
    url('', views.index, name='index'),
]