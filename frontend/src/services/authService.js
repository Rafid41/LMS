const API_URL = "http://127.0.0.1:8000/api/auth";

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw { response: { data, status: response.status } };
  }
  return { status: response.status, data };
};

export const verifyOtp = async (otpData) => {
  const response = await fetch(`${API_URL}/verify-otp/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(otpData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw { response: { data, status: response.status } };
  }
  return { status: response.status, data };
};

export const resendOtp = async (emailData) => {
  const response = await fetch(`${API_URL}/resend-otp/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw { response: { data, status: response.status } };
  }
  return { status: response.status, data };
};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  if (!response.ok) {
    throw { response: { data, status: response.status } };
  }
  return { status: response.status, data };
};

export const forgotPassword = async (data) => {
  const response = await fetch(`${API_URL}/forgot-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw { response: { data: resData, status: response.status } };
  }
  return { status: response.status, data: resData };
};

export const verifyResetOtp = async (data) => {
  const response = await fetch(`${API_URL}/verify-reset-otp/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw { response: { data: resData, status: response.status } };
  }
  return { status: response.status, data: resData };
};

export const resetPassword = async (data) => {
  const response = await fetch(`${API_URL}/reset-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw { response: { data: resData, status: response.status } };
  }
  return { status: response.status, data: resData };
};

export const resendResetOtp = async (data) => {
  const response = await fetch(`${API_URL}/resend-forgot-password-otp/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw { response: { data: resData, status: response.status } };
  }
  return { status: response.status, data: resData };
};
