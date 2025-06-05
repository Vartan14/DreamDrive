from rest_framework import serializers
from .models import TicketTestSession
from tickets.models import Ticket


class TicketTestSessionSerializer(serializers.ModelSerializer):
    ticket_id = serializers.PrimaryKeyRelatedField(
        queryset=Ticket.objects.all(),
        source='ticket',
        write_only=True
    )
    ticket_number = serializers.ReadOnlyField(source='ticket.ticket_number')
    started_at = serializers.DateTimeField(read_only=True)
    completed_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = TicketTestSession
        fields = [
            'id',
            'user_id',
            'ticket_id',
            'ticket_number',
            'started_at',
            'completed_at',
            'is_passed',
            'current_question_index',
            'mistakes_count'
        ]
        read_only_fields = ['id', 'user_id', 'ticket_number', 'started_at', 'completed_at', 'is_passed', 'current_question_index', 'mistakes_count']

    def create(self, validated_data):
        user_id = self.context['user_id']
        return TicketTestSession.objects.create(user_id=user_id, **validated_data)
