import { ex } from "node_modules/@fullcalendar/core/internal-common";

export const API_BASE_URL = 'http://localhost:8005/api/v1/';

// Auth URLs
export const LOGIN_URL = 'auth/login/';
export const REGISTER_URL = 'auth/registration/';
export const REFRESH_URL = 'auth/token/refresh/';
export const LOGOUT_URL = 'auth/logout/';
export const PASSWORD_RESET_URL = 'auth/password/reset/';

// Pyments URLs
export const PAYMENT_URL = 'payments/create-payment/';
export const PAYMENT_STATUS_URL = 'payments/status/';
export const PAYMENT_HISTORY_URL = 'payments/payment-history/';

// User URLs
export const USER_URL = 'users/me/';
export const PASSWORD_CHANGE_URL = 'auth/password/change/';
export const STUDENTS_URL = 'profile/students';
export const TEACHERS_URL = 'profile/teachers/';
export const MY_GROUPS = '/groups/my';
export const ADMIN_GROUPS =  '/groups/admin';

// Schedule URLs
export const TEACHER_EVENTS_URL = 'schedule/teacher/lesson-timeline/';
export const ADMIN_CALENDAR_URL = 'schedule/admin/calendar/';
export const THEORY_LESSON_URL = 'schedule/teacher/theory-lessons/';
export const PRACTICAL_LESSON_URL = 'schedule/teacher/practical-lessons/';

export const AVAILABEL_LESSONS_URL = 'schedule/student/available-practice-lessons';
export const BOOK_LESSON_URL = 'schedule/student/book-practice-lesson';
export const STUDENT_PRACTICAL_LESSONS_URL = 'schedule/student/practice-lessons/';
export const STUDENT_THEORY_LESSONS_URL = 'schedule/student/theory-lessons/';

// Learning URLs
export const RULE_SECTIONS_URL = 'learning/pdr/rule-sections/';
export const RULES_URL = 'learning/pdr/rules/';
export const SIGN_SECTIONS_URL = 'learning/pdr/sign-and-marking-groups/';
export const SIGNS_URL = 'learning/pdr/signs-and-markings/';

