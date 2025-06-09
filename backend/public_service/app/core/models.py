from django.db import models

class Filial(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField(max_length=100)
    latitude = models.DecimalField(max_digits=8, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    def __str__(self):
        return f"{self.name} – {self.city}"


class Review(models.Model):
    filial = models.ForeignKey(Filial, on_delete=models.CASCADE, related_name='reviews')
    student_id = models.IntegerField()  # ID з іншого сервісу, StudentProfile
    student_name = models.CharField(max_length=100)
    rating = models.IntegerField()
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.student_name} ({self.rating}/5)"


class FAQ(models.Model):
    question = models.TextField()
    answer = models.TextField()
    sort_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.question[:50] + ('...' if len(self.question) > 50 else '')


class LandingElement(models.Model):
    section = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    content = models.TextField()
    sort_order = models.IntegerField(default=0)
    image_url = models.URLField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.section} – {self.name}"


class PricePlan(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    currency = models.CharField(max_length=10, default="UAH")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} ({self.price} {self.currency})"
