from django.db import models

from django.db import models

class Article(models.Model):
    user_id = models.IntegerField()
    date = models.DateField()
    title = models.CharField(max_length=255)
    summary = models.TextField()
    leanings = models.DecimalField(max_digits=3, decimal_places=1)
    company = models.CharField(max_length=255)
    isscrape = models.BooleanField(default=False)

class Cloud(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='cloud')
    f_id = models.IntegerField()
    fname = models.CharField(max_length=255)
    extname = models.CharField(max_length=50)
    fsize = models.IntegerField()
    f_width = models.IntegerField()
    f_height = models.IntegerField()
    fdata = models.TextField()  # 이전 예시에서 f_data로 명시되어 있었지만, 일관성을 위해 fdata로 변경을 제안합니다.

class Analysis(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='analysis')
    f_id = models.IntegerField()
    fname = models.CharField(max_length=255)
    extname = models.CharField(max_length=50)
    fsize = models.IntegerField()
    f_width = models.IntegerField()
    f_height = models.IntegerField()
    fdata = models.TextField()  # 마찬가지로 f_data를 fdata로 변경을 제안합니다.
