from django.db import models

class Carriers(models.Model):
    carrier_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    contact_info = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'carriers'
    
    def __str__(self):
        return self.name