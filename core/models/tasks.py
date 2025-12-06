from django.db import models
from .projects import Projects

class Tasks(models.Model):
    STATUS_CHOICES = [
        ('todo', 'À faire'),
        ('in_progress', 'En cours'),
        ('review', 'En revue'),
        ('done', 'Terminé'),
    ]
    
    task_id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Projects, on_delete=models.CASCADE, related_name='tasks')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    due_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='todo')

    class Meta:
        db_table = 'tasks'
    
    def __str__(self):
        return f"{self.name} ({self.project.name})"