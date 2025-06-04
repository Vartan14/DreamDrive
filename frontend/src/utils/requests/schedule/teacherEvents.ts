import apiInstance from '@/utils/axios';
import { TEACHER_EVENTS_URL } from '../../constant';
import { LessonEvent } from '@/types/scheduleInterface';
import {getGroup} from '@/utils/requests/groups';
import { getStudent } from '@/utils/requests/student';


export async function addTitleToLessonEvent(lesson: LessonEvent): Promise<LessonEvent> {
    if (lesson.type === 'theory') {
        try {
            const groupData = await getGroup(lesson.group_id);
            lesson.group = groupData.name;
        } catch (error) {
            console.error(`Error fetching group data for group_id ${lesson.group_id}:`, error);
            lesson.group = 'Unknown Group';
        }
        lesson.title += `\n${lesson.group}`;
    } else if (lesson.type === 'practical') {
        const status =
            lesson.status === 'available' ? 'Доступно до бронювання'
            : lesson.status === 'booked' ? 'Заброньовано'
            : lesson.status === 'completed' ? 'Завершено'
            : lesson.status === 'cancelled' ? 'Скасовано'
            : '—';
        lesson.title += `\n${status}`;

        if (lesson.status == 'booked') {
            try {
                const studentData = await getStudent(lesson.student_id);
                lesson.student = studentData.first_name + ' ' + studentData.last_name || 'Вільно (студента не призначено)';
            } catch (error) {
                console.error(`Error fetching student data for student_id ${lesson.student_id}:`, error);
                lesson.student = 'Unknown Student';
            }
            lesson.title += `\n${lesson.student}`;
        }
    }
    return lesson;
}

export async function getTeacherEvents(withoutTitle: boolean = false): Promise<[LessonEvent]> {
    try {
        const response = await apiInstance.get(`${TEACHER_EVENTS_URL}`);
        const lessons = response.data;
        const lessonEvents = lessons.map((lesson: any) => ({
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

        if (withoutTitle) {
            return lessonEvents as [LessonEvent];
        }
        else {
            const enrichedEvents = await Promise.all(lessonEvents.map(addTitleToLessonEvent));
            return enrichedEvents as [LessonEvent];
        }

    } catch (error: any) {
        console.error('Error while getting teacher events:', error);
        throw error;
    }
}