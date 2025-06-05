import { THEORY_LESSON_URL, PRACTICAL_LESSON_URL } from "@/utils/constant";
import { TheoryLesson, PracticalLesson } from "@/types/scheduleInterface";
import apiInstance from "@/utils/axios";
import { ex } from "node_modules/@fullcalendar/core/internal-common";


export const createTheoryLesson = async (data: TheoryLesson, instructor_id: string = '') => {
  try {
    const params = instructor_id ? { instructor_id } : {};
    const response = await apiInstance.post(THEORY_LESSON_URL, data, { params });
    return response.data;
  } catch (error) {
    console.error("Error creating theory lesson:", error);
    throw error;
  }
};

export const createPracticalLesson = async (data: PracticalLesson, instructor_id: string = '') => {
  try {
    const params = instructor_id ? { instructor_id } : {};
    const response = await apiInstance.post(PRACTICAL_LESSON_URL, data, { params });
    return response.data;
  } catch (error) {
    console.error("Error creating practical lesson:", error);
    throw error;
  }
};

export const updateTheoryLesson = async (id: number, data: TheoryLesson) => {
  try {
    const response = await apiInstance.put(`${THEORY_LESSON_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating theory lesson:", error);
    throw error;
  }
}

export const updatePracticalLesson = async (id: number, data: PracticalLesson) => {
  try {
    const response = await apiInstance.put(`${PRACTICAL_LESSON_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating practical lesson:", error);
    throw error;
  }
}

export const deleteTheoryLesson = async (id: number) => {
  try {
    const response = await apiInstance.patch(`${THEORY_LESSON_URL}${id}/`,
      {params: {status: 'cancelled'}}
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting theory lesson:", error);
    throw error;
  }
}

export const deletePracticalLesson = async (id: number) => {
  try {
    const response = await apiInstance.patch(`${PRACTICAL_LESSON_URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting practical lesson:", error);
    throw error;
  }
}

