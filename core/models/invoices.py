from django.db import models
from .sales_orders import SalesOrders

class Invoices(models.Model):
    STATUS_CHOICES = [
        ('unpaid', 'Non payée'),
        ('paid', 'Payée'),
        ('overdue', 'En retard'),
        ('cancelled', 'Annulée'),
    ]
    
    invoice_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(SalesOrders, on_delete=models.CASCADE)
    invoice_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='unpaid')

    class Meta:
        db_table = 'invoices'
    
    def __str__(self):
        return f"Facture #{self.invoice_id} - {self.order.customer.name}"