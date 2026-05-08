import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthProvider';
import OnboardingApi from '../api/onboardingApi';
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

const MATERIAL_OPTIONS = ['Cotton', 'Silk', 'Denim', 'Leather', 'Linen', 'Wool', 'Polyester'];

const BRAND_SUGGESTIONS = [
    'Nike',
    'Adidas',
    'Zara',
    'H&M',
    'Gucci',
    'Prada',
    'Uniqlo',
    "Levi's",
    'New Balance',
    'Puma',
    'Balenciaga',
    'Chanel',
    'Louis Vuitton',
    'Hermès',
    'Dior',
    'Saint Laurent',
    'Calvin Klein',
];

export const useOnboarding = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const { login } = useAuth();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isAddingOther, setIsAddingOther] = useState(false);
    const [customStyle, setCustomStyle] = useState('');
    const [customHex, setCustomHex] = useState('#6366f1');
    const [customBrand, setCustomBrand] = useState('');

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
        favoriteMaterials: [],
        favoriteBrands: [],
    });

    const filteredBrands = useMemo(() => {
        const query = customBrand.trim().toLowerCase();
        if (!query) return [];

        return BRAND_SUGGESTIONS.filter(
            (brand) => brand.toLowerCase().includes(query) && !formData.favoriteBrands.includes(brand),
        ).slice(0, 3);
    }, [customBrand, formData.favoriteBrands]);

    const handleAddBrand = (brandName) => {
        const targetBrand = (typeof brandName === 'string' ? brandName : customBrand).trim();

        if (targetBrand && !formData.favoriteBrands.includes(targetBrand)) {
            handleTogglePreference('favoriteBrands', targetBrand);
            setCustomBrand('');
        }
    };

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
            const data = await OnboardingApi.completeOnboarding(formData);

            if (data && data.accessToken) {
                const oldRefreshToken = localStorage.getItem('refreshToken');

                await login(data.accessToken, data.refreshToken || oldRefreshToken);

                navigate(PATHS.USER_FEED);
            } else {
                setUser((prev) => ({ ...prev, hasCompletedOnboarding: true }));
                navigate(PATHS.USER_FEED);
            }
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
        customBrand,
        setCustomBrand,
        filteredBrands,
        handleAddBrand,

        // Constants
        STYLE_OPTIONS,
        COLOR_OPTIONS,
        MATERIAL_OPTIONS,

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
