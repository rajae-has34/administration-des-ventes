from django.db import models

class ProductionLines(models.Model):
    line_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    location = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'production_lines'
    
    def __str__(self):
        return self.name