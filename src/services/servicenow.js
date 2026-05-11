import axios from "axios";

const auth = btoa(
  `${import.meta.env.VITE_SN_USERNAME}:${import.meta.env.VITE_SN_PASSWORD}`
);

const api = axios.create({
  baseURL: `${import.meta.env.VITE_SN_INSTANCE}/api/now/table`,
  headers: {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;