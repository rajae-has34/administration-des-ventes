from django.db import models
from .products import Products
from .warehouses import Warehouses

class StockLevels(models.Model):
    stock_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    warehouse = models.ForeignKey(Warehouses, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'stock_levels'
        unique_together = ['product', 'warehouse']
    
    def __str__(self):
        return f"{self.product.name} - {self.warehouse.name}: {self.quantity}"