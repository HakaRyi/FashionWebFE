import { registerApi } from "../api/register";

export const useRegister = () => {
  const handleRegister = async (formData) => {
    return await registerApi(formData);
  };

  return { handleRegister };
};