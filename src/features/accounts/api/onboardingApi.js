import axiosClient from '@/shared/lib/axios';

class OnboardingApi {

    static async completeOnboarding(formData) {
        const submitData = {
            ...formData,
            gender: parseInt(formData.gender),
            height: formData.height ? parseFloat(formData.height) : null,
            weight: formData.weight ? parseFloat(formData.weight) : null,
            waist: formData.waist ? parseFloat(formData.waist) : null,
            hip: formData.hip ? parseFloat(formData.hip) : null,
            bust: formData.bust ? parseFloat(formData.bust) : null,
        };

        const response = await axiosClient.post('/userProfileController/complete-onboarding', submitData);
        return response.data;
    }
}

export default OnboardingApi;