# Generated by Django 4.2.11 on 2024-06-17 09:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("article", "0003_delete_scrape"),
    ]

    operations = [
        migrations.AlterField(
            model_name="article",
            name="date",
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name="article", name="title", field=models.CharField(max_length=255),
        ),
    ]