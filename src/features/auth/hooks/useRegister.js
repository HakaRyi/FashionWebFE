import { useState } from "react";
import { registerApi, verifyOtpApi } from "../api/register";
import { validateAuthForm } from "../utils/validateAuthForm";
import toast from "react-hot-toast";

export const useRegister = (onSwitchMode) => {
  const [formData, setFormData] = useState({
    username: "", email: "", password: "", confirmPassword: "", dateOfBirth: "",
  });
  const [otpCode, setOtpCode] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isStepVerify, setIsStepVerify] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // Bước 1: Đăng ký
  const handleRegisterSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrors({});

    const validationErrors = validateAuthForm(formData, false);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Creating your account...");
    
    try {
      await registerApi(formData);
      toast.success("OTP sent to your email!", { id: loadingToast });
      setIsStepVerify(true);
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      setErrors({ server: msg });
      toast.error(msg, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  // Bước 2: Xác thực OTP
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      toast.error("Please enter 6-digit code");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Verifying code...");
    
    try {
      await verifyOtpApi({ email: formData.email, code: otpCode });
      toast.success("Verification successful!", { id: loadingToast });
      
      setTimeout(() => {
        onSwitchMode();
      }, 1500);
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid OTP";
      toast.error(msg, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData, otpCode, setOtpCode, errors, isLoading, isStepVerify,
    handleChange, handleRegisterSubmit, handleVerifySubmit
  };
};