import { UserData } from "@/store/authStore"
import apiInstance from "../axios"
import { USER_URL } from "../constant"

function mapUserFromApi(apiUser: any): any {
  return {
    user_id: apiUser.id  ?? null,
    email: apiUser.email ?? null,
    first_name: apiUser.first_name ?? 'First Name Not Provided',
    last_name: apiUser.lastName ?? apiUser.last_name ?? 'Last Name Not Provided',
    is_paid: apiUser.is_paid ?? false,
    profile: apiUser.profile ? {
      student_id: apiUser.profile.studentId ?? apiUser.profile.student_id ?? null,
      group_id: apiUser.profile.groupId ?? apiUser.profile.group_id ?? null,
      trainingType: apiUser.profile.trainingType ?? null,
    } : undefined

  };
}

export const fetchMe = async () => {
  const response = await apiInstance.get(USER_URL)

  if (response.status !== 200) {
    throw new Error('Error while fetching user')
  }

  return mapUserFromApi(response.data)
}