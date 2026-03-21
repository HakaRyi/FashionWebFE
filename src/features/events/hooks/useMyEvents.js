import { useEffect, useState } from "react";
import { getEventApi } from "../api/getEvent";

export const useMyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyEvents = async () => {
        try {
            setLoading(true);
            const res = await getEventApi.getMyCreatedEvents();
            setEvents(res.data);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyEvents();
    }, []);

    return {
        events,
        loading,
        refetch: fetchMyEvents
    };
};