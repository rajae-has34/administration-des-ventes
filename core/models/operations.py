from django.db import models
from .work_orders import WorkOrders
from .production_lines import ProductionLines

class Operations(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('in_progress', 'En cours'),
        ('completed', 'Terminée'),
        ('cancelled', 'Annulée'),
    ]
    
    operation_id = models.AutoField(primary_key=True)
    work_order = models.ForeignKey(WorkOrders, on_delete=models.CASCADE)
    line = models.ForeignKey(ProductionLines, on_delete=models.CASCADE)
    operation_name = models.CharField(max_length=255)
    start_time = models.DateTimeField(blank=True, null=True)
    end_time = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')

    class Meta:
        db_table = 'operations'
    
    def __str__(self):
        return f"{self.operation_name} - {self.work_order}"