import { useEffect, useState, useCallback } from "react";
import { getEventApi } from "../api/getEvent";

export const useMyEvents = () => {
    const [hostedEvents, setHostedEvents] = useState([]);
    const [judgingEvents, setJudgingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAllData = useCallback(async () => {
        try {
            setLoading(true);
            // Gọi song song 2 API để tối ưu tốc độ
            const [hostedRes, judgingRes] = await Promise.all([
                getEventApi.getMyCreatedEvents(),
                getEventApi.getHistory()
            ]);
            
            setHostedEvents(hostedRes.data || []);
            setJudgingEvents(judgingRes.data || []);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    return {
        hostedEvents,
        judgingEvents,
        loading,
        refetch: fetchAllData
    };
};