from django.db import models

class Employees(models.Model):
    employee_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=50, blank=True, null=True)
    hire_date = models.DateField()
    job_title = models.CharField(max_length=255, blank=True, null=True)
    department = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'employees'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"