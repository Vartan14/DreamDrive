from django.contrib import admin
from .models import Filial, Review, FAQ, LandingElement, PricePlan


@admin.register(Filial)
class FilialAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'city', 'phone', 'email')
    search_fields = ('name', 'city', 'address', 'phone', 'email')
    list_filter = ('city',)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'student_name', 'filial', 'rating', 'created_at', 'is_active')
    list_filter = ('is_active', 'rating', 'created_at')
    search_fields = ('student_name', 'text')
    autocomplete_fields = ('filial',)
    readonly_fields = ('created_at',)


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('id', 'sort_order', 'question_short', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('question', 'answer')

    def question_short(self, obj):
        return obj.question[:50] + ('...' if len(obj.question) > 50 else '')

    question_short.short_description = "Question"


@admin.register(LandingElement)
class LandingElementAdmin(admin.ModelAdmin):
    list_display = ('id', 'section', 'name', 'sort_order', 'is_active')
    list_filter = ('section', 'is_active')
    search_fields = ('section', 'name', 'content')


@admin.register(PricePlan)
class PricePlanAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'price', 'currency', 'is_active')
    list_filter = ('currency', 'is_active')
    search_fields = ('title', 'description')
