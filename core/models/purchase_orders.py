from django.db import models
from .suppliers import Suppliers

class PurchaseOrders(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('confirmed', 'Confirmée'),
        ('received', 'Reçue'),
        ('cancelled', 'Annulée'),
    ]
    
    po_id = models.AutoField(primary_key=True)
    supplier = models.ForeignKey(Suppliers, on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        db_table = 'purchase_orders'
    
    def __str__(self):
        return f"BC #{self.po_id} - {self.supplier.name}"