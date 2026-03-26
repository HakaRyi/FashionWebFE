import { useState, useEffect } from 'react';
import { registerExpert, expertApi } from '../api/expertApi';

export const useExpertApplication = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [applicationStatus, setApplicationStatus] = useState('None');

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await expertApi.getMyStatus();
                const statusValue = res.data?.status || 'None';
                setApplicationStatus(statusValue);
            } catch (error) {
                console.error('Failed to fetch status');
                setApplicationStatus('None');
            } finally {
                setInitialLoading(false);
            }
        };
        checkStatus();
    }, []);

    const [formData, setFormData] = useState({
        style: 'Stylist',
        customStyle: '',
        styleAesthetic: 'Minimalism',
        customAesthetic: '',
        yearsOfExperience: 1,
        bio: '',
        evidenceType: 'pdf',
        portfolioUrl: '',
        file: null,
    });

    const updateFormData = (data) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const submitApplication = async () => {
        setLoading(true);

        try {
            const payload = {
                ...formData,
                style: formData.style === 'Other' ? formData.customStyle : formData.style,

                styleAesthetic:
                    formData.styleAesthetic === 'Other' ? formData.customAesthetic : formData.styleAesthetic,
            };

            await registerExpert(payload);
            setApplicationStatus('Pending');
            setStep(3);
        } catch (error) {
            alert(error.response?.data || 'Submit failed');
        } finally {
            setLoading(false);
        }
    };

    return {
        step,
        setStep,
        loading,
        initialLoading,
        applicationStatus,
        formData,
        updateFormData,
        submitApplication,
    };
};
