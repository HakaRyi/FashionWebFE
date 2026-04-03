import axiosClient from '@/shared/lib/axios';

const SystemSettingApi = {
  getAllSettings: async () => {
    const response = await axiosClient.get("system-settings"); 
    return response.data;
  },

  getSetting: async (key) => {
    const response = await axiosClient.get(`system-settings/${key}`);
    return response.data;
  },

  updateSetting: async (key, newValue) => {
    const response = await axiosClient.put(`system-settings/${key}`, JSON.stringify(newValue), {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  },

  getEventFees: async () => {
    const response = await axiosClient.get("system-settings/public/event-fees");
    return response.data;
  }
};

export default SystemSettingApi;