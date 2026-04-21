export const validateAuthForm = (formData, isLogin) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate Email
  if (!formData.email?.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Please enter a valid email";
  }

  // Validate Password
  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  // Các trường chỉ dành cho Register
  if (!isLogin) {
    // Validate Username (khớp với field name trong RegisterForm)
    if (!formData.username?.trim()) {
      errors.username = "Please enter your username";
    }

    // Validate Date of Birth
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Please select your date of birth";
    } else {
      const selectedDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (selectedDate > today) {
        errors.dateOfBirth = "Date of birth cannot be in the future";
      }
    }

    // Validate Confirm Password
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  return errors;
};