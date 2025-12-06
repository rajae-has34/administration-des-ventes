from django.db import models
from .production_plans import ProductionPlans
from .products import Products

class PlanItems(models.Model):
    plan_item_id = models.AutoField(primary_key=True)
    plan = models.ForeignKey(ProductionPlans, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    due_date = models.DateField()

    class Meta:
        db_table = 'plan_items'
    
    def __str__(self):
        return f"{self.quantity}x {self.product.name} - {self.due_date}"