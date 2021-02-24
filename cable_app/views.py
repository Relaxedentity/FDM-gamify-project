from django.shortcuts import render, redirect
from mainFDM.models import GameQuestion
from random import choices
from django.http import HttpResponse
from mainFDM.views import results


# Create your views here.
def index(request):
    if request.method == 'POST':

        score = request.POST.get("score-holder")
        request.session["my_score"] = score
        request.session["my_game"] = "Cable"

        # boolean check for path traversals on results page
        request.session["played"] = True

        return redirect(results)

    else:

        stream_type = request.session["stream-type"]

        question_list = GameQuestion.objects.filter(stream_type=stream_type)

        mockArray = [None] * 4
        questions_for_game = [None] * 4
        counter = 0

        # making sure that every question is unique
        while counter < 4:
            choice = choices(question_list, k=1)
            if counter == 0:
                mockArray[0] = choice[0].question
                questions_for_game[0] = choice[0]
                counter += 1
            elif counter == 1:
                if mockArray[0] != choice[0].question:
                    mockArray[1] = choice[0].question
                    questions_for_game[1] = choice[0]
                    counter += 1
            elif counter == 2:
                if mockArray[0] != choice[0].question and mockArray[1] != choice[0].question:
                    mockArray[2] = choice[0].question
                    questions_for_game[2] = choice[0]
                    counter += 1
            elif counter == 3:
                if mockArray[0] != choice[0].question and mockArray[1] != choice[0].question and mockArray[2] != choice[
                    0].question:
                    mockArray[3] = choice[0].question
                    questions_for_game[3] = choice[0]
                    counter += 1

        context = {
            'question_1': questions_for_game[0].question,
            'question_2': questions_for_game[1].question,
            'question_3': questions_for_game[2].question,
            'question_4': questions_for_game[3].question,
            'answer_1': questions_for_game[0].answer,
            'answer_2': questions_for_game[1].answer,
            'answer_3': questions_for_game[2].answer,
            'answer_4': questions_for_game[3].answer
        }

        return render(request, 'cable_app/index.html', context)
