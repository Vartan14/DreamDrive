from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from routers.auth_user_service import auth, profile, users, groups, payment_callback
from routers.learning_service import pdr, tickets, testing
from routers.shedule_service import admin_schedule, teacher_schedule, student_schedule
from routers.payment_service import payments
app = FastAPI(
    title="Gateway API",
    description="API Gateway for DreamDrive Microservices",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[ "http://localhost:8080",],
    allow_credentials=True,  # Дозволити передачу cookies
    allow_methods=["*"],  # Дозволити всі методи (GET, POST, PUT, DELETE тощо)
    allow_headers=["*"],  # Дозволити всі заголовки
)

"""
Home Request
"""
@app.get("/")
def read_root():
    return {"message": "API Gateway is running"}


"""
Auth User Service
"""
app.include_router(auth.router, prefix="/api/v1/auth")

app.include_router(profile.router, prefix="/api/v1/profile")

app.include_router(users.router, prefix="/api/v1/users")

app.include_router(groups.router, prefix="/api/v1/groups")

app.include_router(payment_callback.router, prefix="/api/v1/payment-callback")


"""
Payment Service
"""
app.include_router(payments.router, prefix="/api/v1/payments")

"""
Learning Service
"""
app.include_router(pdr.router, prefix="/api/v1/learning")
app.include_router(tickets.router, prefix="/api/v1/learning")
app.include_router(testing.router, prefix="/api/v1/learning")


"""
Schedule Service
"""
app.include_router(admin_schedule.router, prefix="/api/v1/schedule")
app.include_router(teacher_schedule.router, prefix="/api/v1/schedule")

app.include_router(student_schedule.router, prefix="/api/v1/schedule")