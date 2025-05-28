import apiInstance from './axios';
import { RULE_SECTIONS_URL, RULES_URL } from './constant';

// Отримати всі секції правил дорожнього руху
export const fetchRuleSections = async () => {
  try {
    const response = await apiInstance.get(RULE_SECTIONS_URL);
    console.log("Отримані секції ПДР:", response.data);
    return response.data;
  } catch (error) {
    console.error("Помилка при отриманні секцій ПДР:", error);
    throw error;
  }
};

// Отримати всі правила дорожнього руху
export const fetchRules = async () => {
  try {
    const response = await apiInstance.get(RULES_URL);
    console.log("Отримані правила ПДР:", response.data);
    return response.data;
  } catch (error) {
    console.error("Помилка при отриманні правил ПДР:", error);
    throw error;
  }
};