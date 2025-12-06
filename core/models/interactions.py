from django.db import models
from .customers import Customers
from .contacts import Contacts

class Interactions(models.Model):
    INTERACTION_TYPES = [
        ('call', 'Appel téléphonique'),
        ('email', 'Email'),
        ('meeting', 'Réunion'),
        ('support', 'Support'),
        ('other', 'Autre'),
    ]
    
    interaction_id = models.AutoField(primary_key=True)
    customer = models.ForeignKey(Customers, on_delete=models.CASCADE)
    contact = models.ForeignKey(Contacts, on_delete=models.SET_NULL, blank=True, null=True)
    interaction_date = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=50, choices=INTERACTION_TYPES)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'interactions'
    
    def __str__(self):
        return f"{self.type} - {self.customer.name} - {self.interaction_date}"