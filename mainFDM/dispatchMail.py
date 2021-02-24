from django.conf.global_settings import DEFAULT_FROM_EMAIL
from django.core import mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def dispatch(choice, user):
    """
    This function takes care of dispatching the correct informative email to the user,
    depending on the stream they're interested in
    :param choice: The stream the user is interested in (has played a game for)
    :param user: The email address given by the user for the email to be sent to
    """
    if choice == "BI":

        # subject of the email
        subject = "Business Intelligence"
        # email message created from an HTML template for the chosen stream
        html_message = render_to_string('streamEmails/businessIntelligence.html', {'context': 'values'})

    elif choice == "ST":

        subject = "Software Testing"
        html_message = render_to_string('streamEmails/softwareTesting.html', {'context': 'values'})

    else:
        subject = "Technical Operations"
        html_message = render_to_string('streamEmails/technicalOperations.html', {'context': 'values'})

    plain_message = strip_tags(html_message)
    to = user

    # send the email
    mail.send_mail(subject, plain_message, 'MyCareerPath Team <noreply@mycareerpath.co.uk>', [to], html_message=html_message)