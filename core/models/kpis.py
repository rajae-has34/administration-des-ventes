from django.db import models

class Kpis(models.Model):
    kpi_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    target_value = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    unit = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'kpis'
    
    def __str__(self):
        return self.name