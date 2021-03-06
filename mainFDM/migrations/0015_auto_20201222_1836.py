# Generated by Django 3.1.4 on 2020-12-22 17:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainFDM', '0014_auto_20201221_1033'),
    ]

    operations = [
        migrations.AlterField(
            model_name='score',
            name='game_type',
            field=models.CharField(max_length=50),
        ),
        migrations.AlterField(
            model_name='score',
            name='score',
            field=models.CharField(max_length=10),
        ),
        migrations.AlterUniqueTogether(
            name='score',
            unique_together=set(),
        ),
        migrations.AddConstraint(
            model_name='score',
            constraint=models.UniqueConstraint(fields=('player_username', 'game_type'), name='unique_player_game'),
        ),
    ]
