import json
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.shortcuts import render, redirect
from .dispatchMail import dispatch
from .models import GameQuestion, Score
from .forms import AddQuestion, CreateHelperForm, AddScores, EmailUser
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import messages
from django.http import JsonResponse
import cable_app.views as c
import memoryApp.views as m
import pipeGameApp.views as p


# All views for the pages are here

def home(request):
    """
    Home page view. Mainly used to manipulate the session attributes for the games and redirect to correct games.
    :param request: web request
    :return: web response with the home page HTML template
    """
    # update the results page boolean check for played game
    request.session["played"] = False
    if request.method == "POST":

        # get the stream and game types from the home page buttons
        request.session["stream-type"] = request.POST.get("stream-type-holder")
        game_type = request.POST.get("game-type-holder")
        request.session["my_game"] = game_type

        # redirect to correct games from the stream cards
        if game_type == 'Cable':
            return redirect(c.index)
        elif game_type == "Pipe":
            return redirect(p.index)
        elif game_type == "Memory":
            return redirect(m.index)

    return render(request, 'mainFDM/home.html')


def helper_register(request):
    """
    Helper registration view.
    :param request: Web request
    :return: Register page if the user is not authenticated, helper home page if they are
    or helper login if they already have an account
    """

    # take the user to helper home page if they are already logged in
    if request.user.is_authenticated:
        return redirect('helperHome')
    else:
        # get the create account form
        form = CreateHelperForm()

        if request.method == 'POST':
            form = CreateHelperForm(request.POST)
            if form.is_valid():
                # save the user's data to the database
                form.save()
                # get the entered username
                username = form.cleaned_data.get('username')
                # display a success message with the given username on the log in page
                messages.success(request, ((username[:50] + '...') if len(username) > 50 else username) +
                                 ',\nyou have successfully created a helper account!')
                # take to login page
                return redirect('helperLogin')
            else:
                return render(request, 'mainFDM/helper_register.html', {'form': form})

        context = {'form': form}
        return render(request, 'mainFDM/helper_register.html', context)


def helper_login(request):
    """View for the login page. Allows users to log in, go register or go reset their passwords."""

    # take the user to helper home page if they are already logged in
    if request.user.is_authenticated:
        return redirect('helperHome')
    else:
        # get the log in form
        form = AuthenticationForm()
        if request.method == 'POST':

            # check whether user wants to stay logged in or not
            if request.POST.get('remember-me', None):
                request.session.set_expiry(60 * 60 * 24 * 30)  # keep them logged in for a month
            else:
                request.session.set_expiry(0)  # log them out when the browser closes

            # get data from form
            username = request.POST.get('username')
            password = request.POST.get('password')

            # verify the user
            user = authenticate(request, username=username, password=password)

            if user is not None:
                # check if the user has been approved by the admin
                if user.helper.admin_approved:
                    login(request, user)
                    return redirect('helperHome')

                else:
                    # not approved yet
                    messages.info(request, 'Your account has not yet been approved by the admins.\nThis may take up to '
                                           '24h.')
            else:
                # non-existent user or incorrect credentials entered
                messages.error(request, 'Please enter a correct username and password.\nNote that both fields '
                                        'may be case-sensitive.')

        context = {'form': form}
        # pass the login template
        return render(request, 'mainFDM/helper_login.html', context)


def helper_logout(request):
    """View to log users out. Uses built-in django log out functionality."""
    logout(request)
    return redirect('helperLogin')


@login_required
def helper_home(request):
    """View for the helper home page. Cannot be accessed unless the user is logged in."""
    # data to be passed to the helper home template
    context = {}

    # the question form functionality
    if request.method == "POST":
        q_form = AddQuestion(request.POST)
        if q_form.is_valid():
            # get the question model
            question = GameQuestion()
            # create a new entry from the form data
            question.stream_type = q_form.cleaned_data.get("stream_type")
            question.question = q_form.cleaned_data.get("question")
            question.answer = q_form.cleaned_data.get("answer")
            # add the data to the database
            question.save()

    q_form = AddQuestion()
    context['q_form'] = q_form

    # the best score functionality - query the Score table to get the best score for each game type
    best_cable = Score.objects.filter(game_type='Cable').order_by('score')[:1]
    best_memo = Score.objects.filter(game_type='Memory').order_by('score')[:1]
    best_pipes = Score.objects.filter(game_type='Pipe').order_by('score')[:1]

    # for each score, assign it to a context variable
    for ca in best_cable:
        context['best_cable'] = ca
    for me in best_memo:
        context['best_memo'] = me
    for pi in best_pipes:
        context['best_pipes'] = pi

    # display the list of questions already in the database - query the database to get the questions
    qs = GameQuestion.objects.all()

    # create a list of values from the queryset to prepare for passing to template
    qs_list = list(qs.values())

    # pass the list as json to template
    context['qsjson'] = json.dumps(qs_list)

    return render(request, 'mainFDM/helper_home.html', context)


def results(request):
    """ Results page view """

    # check if the key exists yet - in case someone opens results page directly from url before opening home page
    # if they key does not exist, create it as False (not played yet) and throw them to the home page
    if "played" not in request.session:
        request.session["played"] = False
        return redirect(home)

    # if this user has not yet played
    if request.session["played"] is None or not request.session["played"]:
        return redirect(home)

    # if they have played - display the results page for them
    else:
        # set the game type to the one the user played
        game_played = request.session["my_game"]
        # set the score to the one the user got
        score_got = request.session["my_score"]
        # get the stream type the user entered
        stream_type = request.session["stream-type"]

        # send data to ajax
        data = {'game': game_played}

        # if a form needs submitting
        if request.method == "POST":
            form = AddScores(request.POST)

            # check if the submission concerns the get-info-email form
            if 'email' in request.POST:

                # dispatch an email to the given address
                email = request.POST.get("email")
                dispatch(stream_type, email)

                return redirect(results)

            # the score adding form functionality
            else:

                # if the username is valid
                if form.is_valid():

                    # get the score model
                    score = Score()
                    # get the username of the current user
                    score.player_username = request.POST.get('player_username')
                    # manually set the game type and score to be added to the table as these fields are disabled
                    score.game_type = game_played
                    score.score = score_got

                    # if all validation is passed (including UniqueConstraint)
                    try:
                        # save the data to the database
                        score.save()

                        # get the data for the leaderboard
                        leaderboard_set = Score.objects.filter(game_type=game_played).order_by('score')[:10]
                        leaderboard_set_list = list(leaderboard_set.values())

                        # pass data to ajax
                        data['result'] = 'Submitted'
                        data['message'] = 'Your score has been uploaded!'
                        data['leaderboard'] = leaderboard_set_list

                        return JsonResponse(data, safe=False)

                    # if the UniqueConstraint for the score and game type fails
                    except IntegrityError as e:
                        data['result'] = 'Integrity Error'
                        data['message'] = 'It seems someone with this username has already played this game. ' \
                                          'Choose a different one to save your score!'
                        return JsonResponse(data)
                else:

                    # if the UniqueConstraint for the score and game type fails
                    if KeyError:
                        data['result'] = 'Key Error'
                        data['message'] = 'It seems someone with this username has already played this game. ' \
                                          'Choose a different one to save your score!'
                        return JsonResponse(data)

                    # if something else happens
                    else:
                        data['result'] = 'Other Errors'
                        data['message'] = 'Something went wrong, please try again.'
                        return JsonResponse(data)
        else:
            # pass the upload scores form with the user's result and game they played
            score_form = AddScores(initial={'game_type': game_played,
                                            'score': score_got})
            # pass the info-email form
            email_form = EmailUser()

            # change the shortcuts to real stream names before passing it to the page
            if stream_type == 'BI':
                stream_type = 'Business Intelligence'
            elif stream_type == 'ST':
                stream_type = 'Software Testing'
            else:
                stream_type = 'Technical Operations'

            # pass stuff to the page on load
            context = {
                'form': score_form,
                'email_form': email_form,
                'stream_type': stream_type,
                'game': game_played,
                'tweetURL': 'https://twitter.com/intent/tweet?'
                            'text=I%20just%20got%20a%20time%20of%20' + score_got + '%20on%20the%20' + game_played +
                            ' Game%21%20Try%20and%20beat%20my%20time%20at%20https%3A//mycareerpath.co.uk%20and%20di'
                            'scover%20many%20different%20career%20sectors%20in%20technology%21&hashtags=FDMCareers',
            }
            return render(request, 'mainFDM/results.html', context)
