from django.contrib import admin
from testing.models import TicketTestSession, TicketTestAnswer


class TicketTestSessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'ticket', 'started_at', 'completed_at', 'is_passed', 'mistakes_count')
    search_fields = ('user_id', 'ticket__ticket_number')
    list_filter = ('is_passed', 'completed_at')
    ordering = ('-started_at',)

    fields = ('user_id', 'ticket', 'started_at', 'completed_at', 'is_passed', 'mistakes_count')
    readonly_fields = ('started_at', 'completed_at')  # якщо ці поля не повинні змінюватися вручну

class TicketTestAnswerAdmin(admin.ModelAdmin):
    list_display = ('session', 'question', 'selected_answer', 'is_correct', 'answered_at',
                'question_id')
    search_fields = ('session__user_id', 'question__text')
    list_filter = ('is_correct', 'answered_at')
    ordering = ('-answered_at',)

    fields = ('session', 'question', 'selected_answer', 'is_correct', 'answered_at')
    readonly_fields = ('answered_at',)


admin.site.register(TicketTestSession, TicketTestSessionAdmin)
admin.site.register(TicketTestAnswer, TicketTestAnswerAdmin)


