from django.db import models
from django.contrib.auth.models import User


# All custom database models are here

# extending django User model with a one-to-one field
class HelperProfile(models.Model):
    user = models.OneToOneField(
        User,
        # this works only programmatically inside django or through the django admin page
        # but NOT in MySQL console - this is due to mysql not having the logic for handling the deletion of
        # user profiles with this constraint
        on_delete=models.CASCADE,
        related_name='helper'
    )

    # this field is accessible by querying user.helper.admin_approved
    admin_approved = models.BooleanField(default=False)

    # this is how the entries are labelled on the Django admin page
    def __str__(self):
        return self.user.username


# table for the game questions
class GameQuestion(models.Model):
    stream_type = models.CharField(max_length=50)
    question = models.TextField(max_length=200)
    answer = models.TextField(max_length=400)

    def __str__(self):
        return self.question


# table with the players' scores
class Score(models.Model):
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['player_username', 'game_type'], name='unique_player_game')
        ]

    player_username = models.CharField(max_length=50)
    game_type = models.CharField(max_length=50, blank=True)
    score = models.IntegerField(blank=True)

    def __str__(self):
        return self.player_username, self.game_type
