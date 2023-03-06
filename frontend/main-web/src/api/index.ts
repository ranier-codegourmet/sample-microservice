import axios, { AxiosError } from "axios";

import { LocalStorageKeys } from "@/types/config";

export const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL,
});

export const mainApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MAIN_API_URL,
});

export const bidApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BID_API_URL,
});

export const setHeaders = () => {
  const token = localStorage.getItem(LocalStorageKeys.ACCESS_TOKEN);
  if (token) {
    mainApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    bidApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

export const removeHeaders = () => {
  delete mainApi.defaults.headers.common["Authorization"];
  delete bidApi.defaults.headers.common["Authorization"];
};

mainApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      removeHeaders();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
bidApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      removeHeaders();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
