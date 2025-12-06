from django.db import models
from .products import Products
from .work_orders import WorkOrders

class QualityChecks(models.Model):
    RESULT_CHOICES = [
        ('passed', 'Réussi'),
        ('failed', 'Échoué'),
        ('pending', 'En attente'),
    ]
    
    check_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    work_order = models.ForeignKey(WorkOrders, on_delete=models.CASCADE)
    check_date = models.DateTimeField(auto_now_add=True)
    result = models.CharField(max_length=50, choices=RESULT_CHOICES)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'quality_checks'
    
    def __str__(self):
        return f"Contrôle #{self.check_id} - {self.product.name}"