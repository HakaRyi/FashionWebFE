import { useState, useEffect } from 'react';
import { registerExpert, expertApi } from '../api/expertApi';

export const useExpertApplication = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [applicationStatus, setApplicationStatus] = useState({
        status: 'None',
        reason: '',
        processedAt: null
    });

    const [formData, setFormData] = useState({
        style: 'Stylist',
        customStyle: '',
        styleAesthetic: 'Minimalism',
        customAesthetic: '',
        isOtherAesthetic: false,
        yearsOfExperience: 1,
        bio: '',
        evidenceType: 'pdf',
        portfolioUrl: '',
        file: null,
    });

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await expertApi.getMyStatus();
                if (res.data?.status) {
                    setApplicationStatus({
                        status: res.data.status.status || 'None',
                        reason: res.data.status.reason || '',
                        processedAt: res.data.status.processedAt || null,
                        submittedData: res.data.status
                    });
                }
            } catch (error) {
                setApplicationStatus({ status: 'None', reason: '', processedAt: null });
            } finally {
                setInitialLoading(false);
            }
        };
        checkStatus();
    }, []);

    const updateFormData = (data) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    const submitApplication = async () => {
        setLoading(true);
        try {
            const payload = {
                ...formData,
                style: formData.style === 'Other' ? formData.customStyle : formData.style,
                styleAesthetic: formData.isOtherAesthetic ? formData.customAesthetic : formData.styleAesthetic,
            };

            await registerExpert(payload);
            setApplicationStatus({ status: 'Pending', reason: '', processedAt: null });
            setStep(3);
        } catch (error) {
            alert(error.response?.data?.message || 'Submit failed');
        } finally {
            setLoading(false);
        }
    };

    return {
        step, setStep, loading, initialLoading,
        applicationStatus, formData, updateFormData, submitApplication,
    };
};