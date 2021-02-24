# pages/views.py
from django.http import HttpResponse
from django.shortcuts import render, redirect

import mainFDM.views as m


def index(request):
    if request.method == 'POST':
        score = request.POST.get("score-holder")
        request.session["my_score"] = score
        request.session["my_game"] = "Memory"

        # boolean check for path traversals on results page
        request.session["played"] = True

        print(request.session.get("my_score"))

        return redirect(m.results)

    stream_type = request.session["stream-type"]

    context = {
        'steam_type': stream_type
    }

    return render(request, 'memoryApp/index.html',context)
