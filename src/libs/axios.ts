import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
});

axiosInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

function setAuthorizationHeader({ accessToken }: { accessToken: string }) {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
}

function clearAuthorizationHeader() {
  axiosInstance.defaults.headers.common.Authorization = ``;
}

export { axiosInstance as axios, setAuthorizationHeader, clearAuthorizationHeader };
