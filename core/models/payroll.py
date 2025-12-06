from django.db import models
from .employees import Employees

class Payroll(models.Model):
    payroll_id = models.AutoField(primary_key=True)
    employee = models.ForeignKey(Employees, on_delete=models.CASCADE)
    pay_period_start = models.DateField()
    pay_period_end = models.DateField()
    gross_pay = models.DecimalField(max_digits=10, decimal_places=2)
    net_pay = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateField()

    class Meta:
        db_table = 'payroll'
    
    def __str__(self):
        return f"Paie - {self.employee} - {self.pay_period_start}"