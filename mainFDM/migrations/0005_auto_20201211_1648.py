# Generated by Django 3.1.4 on 2020-12-11 15:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainFDM', '0004_gamequestions'),
    ]

    operations = [
        migrations.CreateModel(
            name='Scores',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('game_type', models.CharField(max_length=200)),
            ],
        ),
        migrations.AlterField(
            model_name='gamequestions',
            name='stream_type',
            field=models.CharField(choices=[('Select', 'Select Stream Type'), ('TOP', 'Technical Operations'), ('BI', 'Business Intelligence'), ('ST', 'Software Testing')], max_length=200),
        ),
    ]
