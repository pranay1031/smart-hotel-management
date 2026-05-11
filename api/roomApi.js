import api from "../services/servicenow";

export const getRooms = async () => {

  try {

    const response = await api.get(
      "/x_1939650_smart_0_room"
    );

    return response.data.result;

  } catch (error) {

    console.error(error);

    return [];
  }
};