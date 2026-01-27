export const API_URL = "http://127.0.0.1:8000/api/admin-content";

export const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  };
};

export const getLanguages = async () => {
  const response = await fetch(`${API_URL}/languages/`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw { response: { data, status: response.status } };
  }
  return data;
};

export const addLanguage = async (languageData) => {
  const response = await fetch(`${API_URL}/languages/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(languageData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw { response: { data, status: response.status } };
  }
  return data;
};

export const updateLanguage = async (id, languageData) => {
  const response = await fetch(`${API_URL}/languages/${id}/`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(languageData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw { response: { data, status: response.status } };
  }
  return data;
};

export const deleteLanguage = async (id) => {
  const response = await fetch(`${API_URL}/languages/${id}/`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) {
    const data = await response.json();
    throw { response: { data, status: response.status } };
  }
  return true;
};

// Timezone APIs
export const getTimezones = async () => {
  const response = await fetch(`${API_URL}/timezones/`, {
    method: "GET",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw { response: { data, status: response.status } };
  }
  return data;
};

export const addTimezone = async (data) => {
  const response = await fetch(`${API_URL}/timezones/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw { response: { data: resData, status: response.status } };
  }
  return resData;
};

export const updateTimezone = async (id, data) => {
  const response = await fetch(`${API_URL}/timezones/${id}/`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const resData = await response.json();
  if (!response.ok) {
    throw { response: { data: resData, status: response.status } };
  }
  return resData;
};

export const deleteTimezone = async (id) => {
  const response = await fetch(`${API_URL}/timezones/${id}/`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!response.ok) {
    const data = await response.json();
    throw { response: { data, status: response.status } };
  }
  return true;
};
