from django.db import models
from .sales_orders import SalesOrders
from .carriers import Carriers

class Shipments(models.Model):
    STATUS_CHOICES = [
        ('preparing', 'En préparation'),
        ('shipped', 'Expédié'),
        ('in_transit', 'En transit'),
        ('delivered', 'Livré'),
        ('cancelled', 'Annulé'),
    ]
    
    shipment_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(SalesOrders, on_delete=models.CASCADE)
    carrier = models.ForeignKey(Carriers, on_delete=models.CASCADE)
    tracking_number = models.CharField(max_length=255, blank=True, null=True)
    shipment_date = models.DateTimeField(blank=True, null=True)
    delivery_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='preparing')

    class Meta:
        db_table = 'shipments'
    
    def __str__(self):
        return f"Expédition #{self.shipment_id} - {self.tracking_number}"