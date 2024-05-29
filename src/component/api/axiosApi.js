import axios from "axios";

import { DangerRight } from "./toastServices";
import { baseURL, key } from "../../component/utils/config";
import { useEffect } from "react";

const getTokenData = () => sessionStorage.getItem("token");

export const apiInstance = axios.create({
  baseURL: baseURL,
});

const cancelTokenSource = axios.CancelToken.source();
const token = sessionStorage.getItem("token");
apiInstance.defaults.headers.common["Authorization"] = token;
apiInstance.defaults.headers.common["key"] = key;

apiInstance.interceptors.request.use(
  function (config) {
    config.cancelToken = cancelTokenSource.token;
    return config;
  },

  function (error) {
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    if (!error?.response?.data?.message) {
      DangerRight("Something went Wrong!");
    }
    if (
      error?.response?.data?.code === "E_USER_NOT_FOUND" ||
      error?.response?.data?.code === "E_UNAUTHORIZED"
    ) {
      sessionStorage.clear();
      window.location.reload(false);
    }

    if (typeof error?.response?.data?.message === "string") {
      DangerRight(error.response.data.message);
    } else {
      for (let i = 0; i < error?.response?.data?.message?.length; i++) {
        DangerRight(error.response.data.message[i]);
      }
      return Promise.reject(error);
    }
  }
);

const handleErrors = async (response) => {
  if (!response.ok) {
    const data = await response.json();
    if (data.message instanceof Array) {
      data.message.forEach((msg) => DangerRight("error", msg));
    } else if (data.message) {
      DangerRight("error", data.message);
    } else {
      DangerRight("error", "Unexpected error occurred.");
    }

    if (data.code === "E_USER_NOT_FOUND" || data.code === "E_UNAUTHORIZED") {
      // Consider handling authentication errors more gracefully
      // e.g., redirect to login page
      // sessionStorage.clear();
      // window.location.reload(false);
    }

    return Promise.reject(data);
  }

  return response.json();
};

const getHeaders = () => ({
  key: key,
  Authorization: getTokenData(),
  "Content-Type": "application/json",
});

export const apiInstanceFetch = {
  baseURL: `${baseURL}`,
  get: (url) =>
    fetch(`${baseURL}${url}`, { method: "GET", headers: getHeaders() }).then(
      handleErrors
    ),

  post: (url, data) =>
    fetch(`${baseURL}${url}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleErrors),

  patch: (url, data) =>
    fetch(`${baseURL}${url}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleErrors),

  put: (url, data) =>
    fetch(`${baseURL}${url}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(handleErrors),

  delete: (url) =>
    fetch(`${baseURL}${url}`, {
      method: "DELETE",
      headers: getHeaders(),
    }).then(handleErrors),
};