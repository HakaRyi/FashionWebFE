import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import OnboardingApi from '../api/OnboardingApi';
import namer from 'color-namer';
import { PATHS } from '@/app/routes/paths';


const STYLE_OPTIONS = ['Minimalism', 'Vintage', 'Streetwear', 'Luxury', 'Casual', 'Bohemian', 'Y2K'];

const COLOR_OPTIONS = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Pastel', hex: '#FFD1DC' },
    { name: 'Earth Tone', hex: '#7B6543' },
    { name: 'Neon', hex: '#CCFF00' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Burgundy', hex: '#800020' },
];

export const useOnboarding = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isAddingOther, setIsAddingOther] = useState(false);
    const [customStyle, setCustomStyle] = useState('');
    const [customHex, setCustomHex] = useState('#6366f1');

    const [formData, setFormData] = useState({
        gender: '',
        height: null,
        weight: null,
        waist: null,
        hip: null,
        bust: null,
        bodyShape: '',
        skinTone: '',
        favoriteStyles: [],
        favoriteColors: [],
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;

        let newValue = value === '' ? null : value;

        if (type === 'number' && value !== '') {
            const numValue = parseFloat(value);
            if (numValue < 0) {
                return;
            }
        }

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleTogglePreference = (type, val) => {
        setFormData((prev) => {
            const current = prev[type];
            const exists = current.includes(val);
            return {
                ...prev,
                [type]: exists ? current.filter((i) => i !== val) : [...current, val],
            };
        });
    };

    const handleAddCustomStyle = () => {
        const trimmed = customStyle.trim();
        if (trimmed) {
            if (!formData.favoriteStyles.includes(trimmed)) {
                handleTogglePreference('favoriteStyles', trimmed);
            }
            setCustomStyle('');
            setIsAddingOther(false);
        }
    };

    const handleCustomColorChange = (e) => {
        const hex = e.target.value;
        setCustomHex(hex);
        const names = namer(hex).ntc;
        const colorName = names[0].name;

        if (!formData.favoriteColors.includes(colorName)) {
            setFormData((prev) => ({
                ...prev,
                favoriteColors: [...prev.favoriteColors, colorName],
            }));
        }
    };

    const handleComplete = async () => {
        setLoading(true);
        try {
            await OnboardingApi.completeOnboarding(formData);
            setUser((prev) => ({ ...prev, hasCompletedOnboarding: true }));
            navigate(PATHS.USER_FEED);
        } catch (error) {
            console.error('Onboarding failed', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Logic helper cho UI
    const isStep1Incomplete = !formData.gender;
    const isStep1PartiallyEmpty = !formData.height || !formData.weight;

    return {
        // State
        step,
        setStep,
        loading,
        formData,
        isAddingOther,
        setIsAddingOther,
        customStyle,
        setCustomStyle,
        customHex,

        // Constants
        STYLE_OPTIONS,
        COLOR_OPTIONS,

        // Computed
        isStep1Incomplete,
        isStep1PartiallyEmpty,

        // Handlers
        handleChange,
        handleTogglePreference,
        handleAddCustomStyle,
        handleCustomColorChange,
        handleComplete,
    };
};
