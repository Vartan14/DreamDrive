from fastapi import FastAPI
from routers.auth_user_service import auth, profiles, users, groups
from routers.learning_service import pdr, tickets, testing
from routers.shedule_service import admin_schedule, teacher_schedule, student_schedule
app = FastAPI(
    title="Gateway API",
    description="API Gateway for DreamDrive Microservices",
    version="1.0.0"
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

app.include_router(profiles.router, prefix="/api/v1/profiles")

app.include_router(users.router, prefix="/api/v1/users")

app.include_router(groups.router, prefix="/api/v1/groups")


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