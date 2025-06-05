import { TEACHERS_URL } from "../constant";
import apiInstance  from "@/utils/axios";

export interface TeacherResource {
    id: string;
    name: string;
    type: "theory" | "practice" | "theory_practice";
}

export const fetchTeachers = async (): Promise<[TeacherResource]> => {
    try {
        const response = await apiInstance.get(TEACHERS_URL);
        
        if (response.status !== 200) {
            throw new Error('Error while fetching teachers');
        }
    
        return response.data.map((teacher: any) => ({
            id: teacher.id,
            name: teacher.name,
            type: teacher.type || "theory_practice",
            })) as [TeacherResource];

    } catch (error: any) {
        console.error('Error while fetching teachers:', error);
        throw error;
    }
    }