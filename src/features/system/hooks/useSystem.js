import { useState, useCallback } from 'react';
import SystemSettingApi from '../api/systemApi';
import { toast } from 'react-toastify';

export const useSystemSettings = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [eventFees, setEventFees] = useState({ FeePercentage: 0, MinFee: 0 });
    const [updatingKey, setUpdatingKey] = useState(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const data = await SystemSettingApi.getAllSettings();
            setSettings(data || []);
        } catch (error) {
            toast.error('Cannot load system settings');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchEventFees = useCallback(async () => {
        try {
            const data = await SystemSettingApi.getEventFees();
            setEventFees(data);
        } catch (error) {
            console.error('Error fetching event fees:', error);
        }
    }, []);

    const handleUpdate = useCallback(async (key, newValue) => {
        if (newValue === undefined || newValue === null) return;
        
        setUpdatingKey(key);
        try {
            await SystemSettingApi.updateSetting(key, newValue);
            
            setSettings((prev) => 
                prev.map((s) => (s.settingKey === key ? { ...s, settingValue: newValue, updatedAt: new Date().toISOString() } : s))
            );
            
            toast.success(`Update successful ${key}`, { autoClose: 2000 });
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Update error!';
            toast.error(errorMsg);
            fetchAll(); 
        } finally {
            setUpdatingKey(null);
        }
    }, [fetchAll]);

    return { 
        settings, 
        eventFees, 
        loading, 
        updatingKey, 
        fetchAll, 
        fetchEventFees, 
        handleUpdate 
    };
};