# Generated by Django 3.1.4 on 2020-12-06 15:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('mainFDM', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='adminaccounts',
            name='firstname',
        ),
        migrations.RemoveField(
            model_name='adminaccounts',
            name='password',
        ),
        migrations.RemoveField(
            model_name='adminaccounts',
            name='surname',
        ),
        migrations.RemoveField(
            model_name='adminaccounts',
            name='username',
        ),
        migrations.AddField(
            model_name='adminaccounts',
            name='name',
            field=models.CharField(default='Admins', max_length=20),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='Users',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=20, unique=True)),
                ('firstname', models.CharField(max_length=40)),
                ('surname', models.CharField(max_length=40)),
                ('password', models.CharField(max_length=15, unique=True)),
                ('accounts', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='mainFDM.adminaccounts')),
            ],
        ),
    ]
