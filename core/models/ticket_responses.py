from django.db import models
from .support_tickets import SupportTickets
from .employees import Employees

class TicketResponses(models.Model):
    response_id = models.AutoField(primary_key=True)
    ticket = models.ForeignKey(SupportTickets, on_delete=models.CASCADE, related_name='responses')
    employee = models.ForeignKey(Employees, on_delete=models.CASCADE)
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ticket_responses'
    
    def __str__(self):
        return f"Réponse #{self.response_id} - Ticket #{self.ticket.ticket_id}"