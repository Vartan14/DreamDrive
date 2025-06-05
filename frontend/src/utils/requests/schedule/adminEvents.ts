import { LessonEvent } from "@/types/scheduleInterface";
import apiInstance from "@/utils/axios";
import {  ADMIN_CALENDAR_URL } from "@/utils/constant";
import { addTitleToLessonEvent } from "@/utils/requests/schedule/teacherEvents";

export async function fecthEventsByTeacher(instructor_id: string): Promise<[LessonEvent]> {
    try {
        const response = await apiInstance.get(ADMIN_CALENDAR_URL, {params: { instructor_id }});
        console.log('Fetched events for instructor:', instructor_id, response.data);
        
        const lessonEvents = response.data.map((lesson: any) => ({
            type: lesson.type,
            id: lesson.data.id,
            start: lesson.data.start_time,
            end: lesson.data.end_time,
            title: lesson.data.title,
            lesson_title: lesson.data.title,
            duration: lesson.data.duration,
            instructor_id: lesson.data.instructor_id,
            filial_id: lesson.data.filial_id,
            resourceId: lesson.data.resource_id || '',
            group: lesson.data.group_id || '',
            group_id: lesson.data.group_id || '',
            status: lesson.data.status,
            location: lesson.data.location || '',
            car: lesson.data.car || '',
            student: lesson.data.student_id || '',
            student_id: lesson.data.student_id || '',
        } as LessonEvent));


        const enrichedEvents = await Promise.all(lessonEvents.map(addTitleToLessonEvent));
        return enrichedEvents as [LessonEvent];
    } catch (error: any) {
        console.error('Error while getting teacher events:', error);
        throw error;
    }
}