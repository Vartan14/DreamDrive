from django.contrib import admin
from .models import Question, Answer, TicketQuestion, Ticket


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 2  # кількість порожніх форм для нових відповідей
    min_num = 1
    max_num = 10


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('ticket_number', 'question_number', 'text_short', 'has_image', 'rule')
    list_filter = ('ticket_number',)
    search_fields = ('question_number', 'text', 'reply_text')
    inlines = [AnswerInline]

    def text_short(self, obj):
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
    text_short.short_description = "Question Text"

    def has_image(self, obj):
        return bool(obj.image)
    has_image.boolean = True
    has_image.short_description = "Image?"

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('question', 'text_short', 'is_correct')
    list_filter = ('is_correct',)
    search_fields = ('text',)

    def text_short(self, obj):
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
    text_short.short_description = "Answer Text"


class TicketQuestionInline(admin.TabularInline):
    model = TicketQuestion
    extra = 2  # кількість порожніх форм для нових питань
    min_num = 1
    max_num = 10


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('name', 'ticket_number', 'is_custom', 'created_at')
    list_filter = ('is_custom',)
    search_fields = ('name', 'ticket_number')
    inlines = [TicketQuestionInline]

    def name(self, obj):
        return obj.name

    name.short_description = "Ticket Name"

    def is_custom(self, obj):
        return obj.is_custom

    is_custom.boolean = True
    is_custom.short_description = "Custom Ticket?"


@admin.register(TicketQuestion)
class TicketQuestionAdmin(admin.ModelAdmin):
    list_display = ('order','ticket', 'question')
    list_filter = ('ticket',)

