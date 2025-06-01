import apiInstance from '../axios';
import { MY_GROUPS, ADMIN_GROUPS } from '../constant';


export const fetchMyGroups = async (onlyNames: boolean=false) => {
  try {
    const response = await apiInstance.get(MY_GROUPS);
   
    if (onlyNames) {
        return response.data.map(group => ({
            id: group.id,
            name: group.name.trim(),
        }));

    }  else {
        console.log("Fetched groups:", response.data);

        return response.data;
    }

  } catch (error) {
    console.error("Error while fetching groups", error);
    throw error;
  }
};

export const getGroup = async (group_id) => {
  try {
    const response = await apiInstance.get(`${ADMIN_GROUPS}/${group_id}/`);
    console.log("Fetched group:", response.data);
    
    return response.data

  } catch (error) {
    console.error("Error while fetching group", error);
    throw error;
  }
};


