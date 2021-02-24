from django.shortcuts import render, redirect
from mainFDM.models import GameQuestion
from random import choices
import mainFDM.views as m
from django.http import HttpResponse
# Create your views here.

def index(request):

    if request.method == 'POST':
        score = request.POST.get("score-holder")
        request.session["my_score"] = score
        request.session["my_game"] = "Pipe"

        # boolean check for path traversals on results page
        request.session["played"] = True

        print(request.session.get("my_score"))

        return redirect(m.results)


    # boolean check for path traversals on results page
    request.session["played"] = True

    stream_type = request.session["stream-type"]

    question_list = GameQuestion.objects.filter(stream_type=stream_type)

    mockArray = [None]*4
    questions_for_game= [None]*4
    counter =0

    # making sure that every question is unique
    while counter<4:
        choice = choices(question_list, k=1)
        if counter==0:
            mockArray[0]=choice[0].question
            questions_for_game[0] = choice[0]
            counter+=1
        elif counter==1:
            if mockArray[0]!= choice[0].question:
                mockArray[1] = choice[0].question
                questions_for_game[1] = choice[0]
                counter += 1
        elif counter==2:
            if mockArray[0]!= choice[0].question and mockArray[1]!= choice[0].question:
                mockArray[2] = choice[0].question
                questions_for_game[2] = choice[0]
                counter += 1
        elif counter==3:
            if mockArray[0]!= choice[0].question and mockArray[1]!= choice[0].question and mockArray[2]!= choice[0].question:
                mockArray[3] = choice[0].question
                questions_for_game[3] = choice[0]
                counter += 1


    context = {
        'question_1': questions_for_game[0].question,

        'answer_1': questions_for_game[0].answer,
        'answer_2': questions_for_game[1].answer,
        'answer_3': questions_for_game[2].answer

    }

    return render(request, 'pipeGameApp/index.html',context)

