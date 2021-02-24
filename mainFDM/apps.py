from django.apps import AppConfig


class MainConfig(AppConfig):
    name = 'mainFDM'

    # loading the signals file to make sure the HelperProfiles model will get updated simultaneously with the User model
    def ready(self):
        from mainFDM import signals
