from django.db import models

class Projects(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Non commencé'),
        ('in_progress', 'En cours'),
        ('completed', 'Terminé'),
        ('on_hold', 'En attente'),
        ('cancelled', 'Annulé'),
    ]
    
    project_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='not_started')

    class Meta:
        db_table = 'projects'
    
    def __str__(self):
        return self.name