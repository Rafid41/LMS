import { API_URL, getHeaders } from "./adminService";

export const getProfile = async () => {
    const response = await fetch(`${API_URL.replace('admin-content', 'auth')}/profile/`, {
        method: "GET",
        headers: getHeaders(),
    });
    const resData = await response.json();
    if (!response.ok) {
        throw { response: { data: resData, status: response.status } };
    }
    return resData;
};

export const updateProfile = async (data) => {
    // If data contains files (like profile_photo), we might need FormData
    // But for now assuming JSON or FormData is handled by the caller or we check here
    
    // Check if input is FormData
    const isFormData = data instanceof FormData;
    const headers = getHeaders();
    
    if (isFormData) {
        // Remove Content-Type header to let browser set it with boundary for FormData
        delete headers['Content-Type'];
    }

    const response = await fetch(`${API_URL.replace('admin-content', 'auth')}/profile/`, {
        method: "PATCH",
        headers: headers,
        body: isFormData ? data : JSON.stringify(data),
    });
    const resData = await response.json();
    if (!response.ok) {
        throw { response: { data: resData, status: response.status } };
    }
    return resData;
};

export const updateLearnerProfile = async (data) => {
    const headers = getHeaders();
    const response = await fetch(`${API_URL.replace('admin-content', 'learner')}/profile/`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(data),
    });
    const resData = await response.json();
    if (!response.ok) {
        throw { response: { data: resData, status: response.status } };
    }
    return resData;
};

export const updateInstructorProfile = async (data) => {
    const headers = getHeaders();
    const response = await fetch(`${API_URL.replace('admin-content', 'instructor')}/profile/`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(data),
    });
    const resData = await response.json();
    if (!response.ok) {
        throw { response: { data: resData, status: response.status } };
    }
    return resData;
};
