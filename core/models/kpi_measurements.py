from django.db import models
from .kpis import Kpis

class KpiMeasurements(models.Model):
    measurement_id = models.AutoField(primary_key=True)
    kpi = models.ForeignKey(Kpis, on_delete=models.CASCADE)
    measurement_date = models.DateField()
    actual_value = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'kpi_measurements'
    
    def __str__(self):
        return f"{self.kpi.name} - {self.measurement_date}"