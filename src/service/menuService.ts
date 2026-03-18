import apiClient from "../Api/ApiBas";
import { GET_MENU_ITEM } from "../Api/API_EndPowint";

export const menuService = {

  async getMenu() {
    const res = await apiClient.get(GET_MENU_ITEM);
    return res.data;
  },

};