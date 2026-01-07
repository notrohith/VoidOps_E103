// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (Indian format)
export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// Password validation
export const isValidPassword = (password) => {
  return password.length >= 6;
};

// Validate registration data
export const validateRegistration = (data, userType) => {
  const errors = {};

  // Common validations
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.phone) {
    errors.phone = 'Phone number is required';
  } else if (!isValidPhone(data.phone)) {
    errors.phone = 'Invalid phone number (10 digits, starting with 6-9)';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(data.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  // Business user specific validations
  if (userType === 'business') {
    if (!data.businessProfile?.businessName) {
      errors.businessName = 'Business name is required';
    }

    if (!data.businessProfile?.businessType) {
      errors.businessType = 'Business type is required';
    }

    if (!data.businessProfile?.location?.city) {
      errors.city = 'City is required';
    }

    if (!data.businessProfile?.location?.state) {
      errors.state = 'State is required';
    }

    if (!data.businessProfile?.weeklyTime || data.businessProfile.weeklyTime < 1) {
      errors.weeklyTime = 'Weekly time must be at least 1 hour';
    }

    if (data.businessProfile?.monthlyBudget === undefined || data.businessProfile.monthlyBudget < 0) {
      errors.monthlyBudget = 'Monthly budget is required';
    }

    if (!data.businessProfile?.teamSize || data.businessProfile.teamSize < 1) {
      errors.teamSize = 'Team size must be at least 1';
    }

    if (!data.businessProfile?.techComfort) {
      errors.techComfort = 'Technical comfort level is required';
    }

    if (!data.businessProfile?.primaryGoal) {
      errors.primaryGoal = 'Primary goal is required';
    }
  }

  return errors;
};

// Validate login data
export const validateLogin = (data) => {
  const errors = {};

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return errors;
};