from django.db import models
from .products import Products

class WorkOrders(models.Model):
    STATUS_CHOICES = [
        ('planned', 'Planifiée'),
        ('in_progress', 'En cours'),
        ('completed', 'Terminée'),
        ('cancelled', 'Annulée'),
    ]
    
    work_order_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='planned')

    class Meta:
        db_table = 'work_orders'
    
    def __str__(self):
        return f"OT #{self.work_order_id} - {self.product.name} ({self.quantity})"