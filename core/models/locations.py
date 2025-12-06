from django.db import models
from .warehouses import Warehouses

class Locations(models.Model):
    location_id = models.AutoField(primary_key=True)
    warehouse = models.ForeignKey(Warehouses, on_delete=models.CASCADE)
    location_code = models.CharField(max_length=255)

    class Meta:
        db_table = 'locations'
    
    def __str__(self):
        return f"{self.location_code} ({self.warehouse.name})"