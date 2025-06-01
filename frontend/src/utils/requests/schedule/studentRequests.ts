import apiInstance from '@/utils/axios';
import { AVAILABEL_LESSONS_URL } from '../../constant';
import { LessonEvent } from '@/types/scheduleInterface';


export async function fetchAvailablePracticeLessons(): Promise<[LessonEvent]> {
    try {
        const response = await apiInstance.get(AVAILABEL_LESSONS_URL);
        
        const lessons = response.data;
        const lessonEvents = lessons.map((lesson: any) => ({
           
            id: lesson.data.id,
            type: 'practical',
            title: lesson.data.title,

            start: lesson.data.start_time,
            end: lesson.data.end_time,
            duration: lesson.data.duration,

            instructor_id: lesson.data.instructor_id,
            instructor_name: lesson.data.instructor_name,

            filial_id: lesson.data.filial_id,
         
            status: lesson.data.status,
            location: lesson.data.location || '',
            car: lesson.data.car || '',

        } as LessonEvent));

        return lessonEvents;
   
        
    } catch (error: any) {
        console.error('Error while getting available lessons:', error);
        throw error;
    }
}