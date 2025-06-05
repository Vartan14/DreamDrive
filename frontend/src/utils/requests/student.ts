import { STUDENTS_URL } from "../constant";
import apiInstance from "../axios";


export const getStudent = async (student_id: string) => {
  try {
    let url = STUDENTS_URL;
    if (student_id) {
      url += `/${student_id}/`;
    }
    
    const response = await apiInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Error while fetching students:", error);
    throw error;
  }
};
