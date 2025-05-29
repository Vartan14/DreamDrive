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

// User URLs
export const USER_URL = 'users/me/';


// Learning URLs
export const RULE_SECTIONS_URL = 'learning/pdr/rule-sections/';
export const RULES_URL = 'learning/pdr/rules/';
export const RULE_QUESTIONS_URL = 'learning/pdr/rule-questions/';