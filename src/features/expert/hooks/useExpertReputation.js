import { useState, useEffect } from 'react';
import { expertApi } from '../api/expertApi';

export const useExpertReputation = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReputation = async () => {
        setLoading(true);
        try {
            const response = await expertApi.getMyReputation();
            setData(response.data);
        } catch (err) {
            console.error('Error when retrieving reputable data:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReputation();
    }, []);

    return { data, loading, error, refresh: fetchReputation };
};
