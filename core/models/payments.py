from django.db import models
from .invoices import Invoices

class Payments(models.Model):
    PAYMENT_METHODS = [
        ('cash', 'Espèces'),
        ('card', 'Carte'),
        ('transfer', 'Virement'),
        ('check', 'Chèque'),
    ]
    
    payment_id = models.AutoField(primary_key=True)
    invoice = models.ForeignKey(Invoices, on_delete=models.CASCADE)
    payment_date = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=50, choices=PAYMENT_METHODS)

    class Meta:
        db_table = 'payments'
    
    def __str__(self):
        return f"Paiement #{self.payment_id} - {self.amount}"