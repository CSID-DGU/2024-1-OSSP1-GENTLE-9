from django.db import models

# Create your models here.
class user_model(models.Model):
    username = models.CharField(max_length=255)
    firstname = models.CharField(max_length=255)
    def __str__(self):
        return self.username