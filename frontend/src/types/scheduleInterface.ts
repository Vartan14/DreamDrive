import { ex } from "node_modules/@fullcalendar/core/internal-common";


export interface LessonEvent {
  type: "theory" | "practical";
  id: string;
  lesson_title?: string;
  title: string;
  start: string;
  end: string;
  duration: string;

  filial_id: string;
  resourceId?: string;

  // Optional fields for theory lessons
  group?: string;
  group_id?: string;
  is_online?: boolean;

  // Optional fields for practical lessons
  status?: 'available' | 'booked' | 'completed' | 'cancelled';
  student?: string;
  student_id?: string;
  location?: string;
  car?: string;

  isEdited?: boolean;

  // Fields for student
  instructor_id?: number | string;
  instructor_name?: string; 

}

export interface InstructorResource {
  id: string;
  title: string;
}

export interface CreateTheoryLessonData {
  id?: string;
  date: Date;
  time: string;
  lesson_title: string;
  duration: string;
  filial_id: string;
  is_online: boolean;
  group: {
    id: string;
    name: string;
  };
  
}

export interface CreatePracticalLessonData {
  id?: string;
  date: Date;
  time: string;
  lesson_title: string;
  duration: string;
  filial_id: string;
  car: string;
  location: string;
}

export interface TheoryLesson {
  title: string;
  start_time: string;
  duration: string;
  group_id: string;
  filial_id: string;
  is_online: boolean;
  instructor_name: string;

}

export interface PracticalLesson {
  title: string;
  start_time: string;
  duration: string;
  filial_id: string;
  car: string;
  location: string;
  instructor_name: string;

}


