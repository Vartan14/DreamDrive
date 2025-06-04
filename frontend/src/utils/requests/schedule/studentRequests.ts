import apiInstance from '@/utils/axios';
import { 
    AVAILABEL_LESSONS_URL,
    BOOK_LESSON_URL,
    STUDENT_PRACTICAL_LESSONS_URL,
    STUDENT_THEORY_LESSONS_URL
} from '../../constant';

import { LessonEvent } from '@/types/scheduleInterface';


export async function fetchAvailablePracticeLessons(): Promise<[LessonEvent]> {
    try {
        const response = await apiInstance.get(AVAILABEL_LESSONS_URL);
        
        const lessons = response.data;
        console.log('Available lessons:', lessons);

        const lessonEvents = lessons.map((lesson: any) => ({
           
            id: lesson.id,
            type: 'practical',
            title: lesson.title,    

            start: lesson.start_time,
            end: lesson.end_time,
            duration: lesson.duration,

            instructor_id: lesson.instructor_id,
            instructor_name: lesson.instructor_name,

            filial_id: lesson.filial_id,
         
            status: lesson.status,
            location: lesson.location || '',
            car: lesson.car || '',

        } as LessonEvent));

        return lessonEvents;
   
        
    } catch (error: any) {
        console.error('Error while getting available lessons:', error);
        throw error;
    }
}

export async function bookPracticeLesson(lessonId: string): Promise<void> {
    try {
        const response = await apiInstance.patch(`${BOOK_LESSON_URL}/${lessonId}`);
        console.log('Lesson booked successfully:', response.data);
    } catch (error: any) {
        console.error('Error while booking lesson:', error);
        throw error;
    }
}

export async function fetchStudentLessons(): Promise<[LessonEvent]> {
    try {
        const practical_res = await apiInstance.get(STUDENT_PRACTICAL_LESSONS_URL);
        const theory_res = await apiInstance.get(STUDENT_THEORY_LESSONS_URL);

        const practicalLessons = practical_res.data.map((lesson: any) => ({
            id: lesson.id,
            type: 'practical',
            title: lesson.title,
            start: lesson.start_time,
            end: lesson.end_time,
            duration: lesson.duration,
            filial_id: lesson.filial_id,

            instructor_id: lesson.instructor_id,
            instructor_name: lesson.instructor_name,
            status: lesson.status,
            location: lesson.location || '',
            car: lesson.car || '',
        } as LessonEvent));

        const theoryLessons = theory_res.data.map((lesson: any) => ({
            id: lesson.id,
            type: 'theory',
            title: lesson.title,
            start: lesson.start_time,
            end: lesson.end_time,
            duration: lesson.duration,
            filial_id: lesson.filial_id,

            instructor_id: lesson.instructor_id,
            instructor_name: lesson.instructor_name,
            group_id: lesson.group_id || '',
            is_online: lesson.is_online || false,
        } as LessonEvent));

        return practicalLessons.concat(theoryLessons) as [LessonEvent];

    } catch (error: any) {
        console.error('Error while fetching student lessons:', error);
        throw error;
    }


}