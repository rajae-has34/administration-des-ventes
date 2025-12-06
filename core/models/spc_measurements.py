from django.db import models
from .quality_checks import QualityChecks

class SpcMeasurements(models.Model):
    measurement_id = models.AutoField(primary_key=True)
    quality_check = models.ForeignKey(QualityChecks, on_delete=models.CASCADE)  # Renommé de 'check' à 'quality_check'
    parameter_name = models.CharField(max_length=255)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    upper_control_limit = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    lower_control_limit = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        db_table = 'spc_measurements'
    
    def __str__(self):
        return f"{self.parameter_name}: {self.value}"