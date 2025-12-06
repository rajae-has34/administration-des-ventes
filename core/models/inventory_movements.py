from django.db import models
from .products import Products
from .locations import Locations

class InventoryMovements(models.Model):
    movement_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    from_location = models.ForeignKey(Locations, on_delete=models.CASCADE, related_name='from_movements')
    to_location = models.ForeignKey(Locations, on_delete=models.CASCADE, related_name='to_movements')
    quantity = models.IntegerField()
    movement_date = models.DateTimeField(auto_now_add=True)
    reason = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'inventory_movements'
    
    def __str__(self):
        return f"Movement #{self.movement_id} - {self.product.name}"