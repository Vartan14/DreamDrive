

export interface LessonEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: "theory" | "practical";
  resourceId?: string;
  group?: string;
  student?: string;
  is_online?: boolean;
  location: string;
  car?: string;
  instructor_id: number | string;
}

export interface InstructorResource {
  id: string;
  title: string;
}

export interface CreateTheoryLessonData {
  date: Date;
  time: string;
  duration: string;
  filial_id: string;
  is_online: boolean;
  group_id: string;
  title: string;
}

export interface CreatePracticalLessonData {
  date: Date;
  time: string;
  duration: string;
  filial_id: string;
  car: string;
  location: string;
}

