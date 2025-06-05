import exp from "constants";
import apiInstance from "../axios"
import { USER_URL, PASSWORD_CHANGE_URL } from "../constant"
import { UserData } from "@/types/userInterface";
import { ca } from "date-fns/locale";

function mapUserFromApi(apiUser: any): UserData {
  return {
    user_id: apiUser.profile?.id || apiUser.id, 
    email: apiUser.email,
    role: apiUser.role,
    first_name: apiUser.first_name,
    last_name: apiUser.last_name,

    type: apiUser.profile?.type || null, 
    phone: apiUser.phone || null,
    about_me: apiUser.about_me || null,

    // Optional fields for students
    is_paid: apiUser.is_paid || false, 
    group_id: apiUser.profile?.group_id || null, 
    student_id: apiUser.id || null, 

    //Optional fields for teachers
    teacher_id: apiUser.id || null
}}

export const fetchMe = async () => {
  const response = await apiInstance.get(USER_URL)

  if (response.status !== 200) {
    throw new Error('Error while fetching user')
  }

  return mapUserFromApi(response.data)
}

export const updateUser = async (user: Partial<UserData>) : Promise<UserData>  =>   {
  const response = await apiInstance.patch(USER_URL, user)

  if (response.status !== 200) {
    throw new Error('Error while updating user')
  }

  return mapUserFromApi(response.data)
}

export const changePassword = async (newPassword1: string, newPassword2: string) => {
  try {
    const response = await apiInstance.post(PASSWORD_CHANGE_URL, {
      new_password1: newPassword1,
      new_password2: newPassword2
    });

    return response

  }  catch (error: any) {
    //console.error('Error while changing password:', error);
    return error
  } 
}
