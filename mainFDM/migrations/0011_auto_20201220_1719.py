# Generated by Django 3.1.4 on 2020-12-20 16:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainFDM', '0010_auto_20201220_1215'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gamequestion',
            name='stream_type',
            field=models.CharField(max_length=50),
        ),
    ]
