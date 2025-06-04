
export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserData {
    user_id: string;
    email: string;
    role: string;
    first_name?: string;
    last_name?: string;

    type?: "theory" | "practice" | "theory_practice" | null;
    phone?: string | null;
    about_me?: string | null;
    // Only for students
    is_paid?: boolean;
    group_id?: string | null; 
    student_id?: string | null;

    // Only for teachers
    teacher_id?: string | null;
    profilePicture?: string | null;
};


