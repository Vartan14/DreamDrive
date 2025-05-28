
export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserData {
    user_id: string | null;
    email: string | null;
    role: string | null;
    first_name?: string | null;
    last_name?: string | null;
    is_paid?: boolean;
    profile? : {
        student_id?: string | null;
        group_id?: string | null;
        trainingType?: string | null;
    },
    profilePicture?: string | "";    
};


// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: UserRole;
//   profilePicture?: string;
//   bio?: string;
//   isSubscribed?: boolean; // For students - whether they have paid for premium access
//   trainingType?: 'Theory' | 'Practice'; // For instructors - type of training they provide
// }

// export interface StudentProfile extends User {
//   role: 'student';
//   progress: {
//     completedMaterials: number;
//     totalMaterials: number;
//     completedTests: number;
//     testScores: number[];
//   };
//   paymentStatus: 'paid' | 'unpaid';
//   assignedInstructor?: string;
// }

// export interface InstructorProfile extends User {
//   role: 'instructor';
//   students: string[]; // IDs of assigned students
//   specialization: string[];
//   experience: number; // Years of experience
//   ratings: number;
//   trainingType: 'Theory' | 'Practice'; // Type of training they provide
// }

// export interface AdminProfile extends User {
//   role: 'admin';
//   accessLevel: 'full' | 'limited';
// }

// export type UserProfile = StudentProfile | InstructorProfile | AdminProfile;

// export interface AuthState {
//   user: UserProfile | null;
//   isLoading: boolean;
//   error: string | null;
// }
