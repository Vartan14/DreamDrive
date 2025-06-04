import { config, title } from 'process';
import apiInstance from '../axios';
import { RULE_SECTIONS_URL, RULES_URL, SIGN_SECTIONS_URL, SIGNS_URL } from '../constant';
import { text } from 'stream/consumers';
import type { Rule } from '@/types/ruleInterface';
import { group } from 'console';


export const fetchRuleSections = async () => {
  try {
    const response = await apiInstance.get(RULE_SECTIONS_URL);
    console.log("Отримані секції ПДР:", response.data);
    
    return response.data

  } catch (error) {
    console.error("Помилка при отриманні секцій ПДР:", error);
    throw error;
  }
};


export const fetchSignSections= async () => {
  try {
    const response = await apiInstance.get(SIGN_SECTIONS_URL);
    console.log("Отримані секції Дорожніх знаків і розмітки:", response.data);
    return response.data;
  } catch (error) {
    console.error("Помилка при отриманні Дорожніх знаків:", error);
    throw error;
  }
};


export const fetchRules = async (section_number: string): Promise<Rule[]> => {
  try {
    const response = await apiInstance.get(
      RULES_URL, {
      params: {
        section: section_number
      }
    });
    console.log("Отримані правила ПДР:", response.data);
    return response.data as Rule[];
  } catch (error) {
    console.error("Помилка при отриманні правил ПДР:", error);
    throw error;
  }
};


export const fetchSigns = async (group_id: string): Promise<Rule[]> => {
  try {
    const response = await apiInstance.get(SIGNS_URL, {params: {group: group_id}});
    console.log(`Отримані Дорожні знаки групи ${group_id}:`, response.data);
    return response.data.map((sign: any) => ({
      id: sign.id,
      rule_id: sign.element_id,
      text: sign.text,
      img_url: sign.image.replace('localhost', 'localhost:8001'),
      sing_name: sign.name,
      section_number: sign.group_number
    }));
  } catch (error) {
    console.error("Помилка при отриманні правил ПДР:", error);
    throw error;
  }
};