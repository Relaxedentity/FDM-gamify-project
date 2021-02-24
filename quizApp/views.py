from django.shortcuts import render


# Create your views here.

def index(request):
    """Pass the quiz app template"""
    return render(request, 'quizApp/index.html')
