from django.db import models
from .purchase_orders import PurchaseOrders
from .products import Products

class PoItems(models.Model):
    po_item_id = models.AutoField(primary_key=True)
    po = models.ForeignKey(PurchaseOrders, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'po_items'
    
    def __str__(self):
        return f"{self.quantity}x {self.product.name} (BC #{self.po.po_id})"