from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.core.exceptions import NON_FIELD_ERRORS, ValidationError
from django.forms import ModelForm
from django.utils.translation import gettext_lazy as _
from mainFDM.models import Score

# stream type choices for the helper add question form
STREAM_TYPES = (
    ("", "Select Stream Type"),
    ("TO", "Technical Operations"),
    ("BI", "Business Intelligence"),
    ("ST", "Software Testing"),
)


# add question form from the helper home page
class AddQuestion(forms.Form):
    stream_type = forms.ChoiceField(widget=forms.Select(attrs={'class': 'form-select mb-3',
                                                               'title': 'Choose the stream type here!',
                                                               'placeholder': 'Select Stream Type',
                                                               'aria-label': 'Default select', 'id': 'floatingSelect'}),
                                    choices=STREAM_TYPES)
    question = forms.CharField(max_length=200, widget=forms.Textarea(attrs={'class': 'form-control',
                                                                            'style': 'height:70px',
                                                                            'placeholder': 'Question',
                                                                            'title': 'Add your question here!',
                                                                            'id': 'floatingQuestion'}))

    answer = forms.CharField(max_length=400, widget=forms.Textarea(attrs={'type': "text", 'class': 'form-control',
                                                                          'style': 'height: 100px',
                                                                          'placeholder': 'Answer',
                                                                          'title': 'Add the correct answer here!',
                                                                          'id': 'floatingAnswer'}))


# custom helper registration form using the built-in Django UserCreationForm
class CreateHelperForm(UserCreationForm):
    password1 = forms.CharField(label=_("Password"),
                                widget=forms.PasswordInput(attrs={'class': 'form-control',
                                                                  'style': 'height:max-content',
                                                                  'title': 'Enter your password',
                                                                  'placeholder': 'Enter your password...',
                                                                  'id': 'floatingPassword1'}))
    password2 = forms.CharField(label=_("Password confirmation"),
                                widget=forms.PasswordInput(attrs={'class': 'form-control',
                                                                  'style': 'height:max-content',
                                                                  'title': 'Repeat your password',
                                                                  'placeholder': 'Confirm your password...',
                                                                  'id': 'floatingPassword2'}),
                                help_text=_("Enter the same password as above, for verification."))

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control',
                                               'style': 'height:max-content',
                                               'placeholder': 'Enter your username...',
                                               'title': 'Enter your username here',
                                               'id': 'floatingUsername', 'required': True}),
            'email': forms.TextInput(attrs={'type': "text", 'class': 'form-control',
                                            'style': 'height:max-content',
                                            'placeholder': 'Enter your email address...',
                                            'title': 'Enter your email address',
                                            'id': 'floatingEmail', 'required': True}),
        }

    def clean_email(self):
        """
        Custom clean email method to check for duplicate email entries, while not interfering with other built-in
        django validation. In case the email doesn't pass the check, the submission fails,
        and a message is shown to the user
        :return: cleaned email if it passed the validation
        """
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise ValidationError("An account with this email already exists in the system.\n Please enter a "
                                  "different email address.")
        return email


# form for uploading game scores, which is on the results page
class AddScores(ModelForm):
    class Meta:
        model = Score
        fields = ['player_username', 'game_type', 'score']
        labels = {
            'player_username': _('Please enter your username:'),
            'game_type': _('Game you played:'),
            'score': _('Your score:')
        }
        error_messages = {
            NON_FIELD_ERRORS: {
                'unique_together': "%(player_username)s's %(game_type)s are not unique.",
            }
        }
        widgets = {
            'player_username': forms.TextInput(attrs={'class': 'form-control',
                                                      'style': 'height:max-content',
                                                      'placeholder': 'Username',
                                                      'title': 'Enter your username here',
                                                      'id': 'upload-user'}),
            'game_type': forms.TextInput(attrs={'type': "text", 'class': 'form-control form-readonly',
                                                'style': 'height:max-content',
                                                'placeholder': 'Game type',
                                                'title': 'This is the game you played',
                                                'id': 'upload-game', 'disabled': True}),
            'score': forms.TextInput(attrs={'type': "text", 'class': 'form-control form-readonly',
                                            'style': 'height:max-content',
                                            'placeholder': 'Your Score',
                                            'title': 'This is your score',
                                            'id': 'upload-score', 'disabled': True})
        }


# form to enter the email to which the stream information email from results page should be sent
class EmailUser(forms.Form):
    email = forms.CharField(label="Please enter your email address here...",
                            widget=forms.EmailInput(attrs={'type': 'email', 'class': 'form-control',
                                                           'placeholder': 'Enter your email address...',
                                                           'title': 'Enter your email address',
                                                           'id': 'floatingEmail', 'required': True}))
