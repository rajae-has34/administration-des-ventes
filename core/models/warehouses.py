from django.db import models

class Warehouses(models.Model):
    warehouse_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    location = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'warehouses'
    
    def __str__(self):
        return self.name