import axios from 'axios';

const SN_INSTANCE = import.meta.env.VITE_SN_INSTANCE;
const SN_USERNAME = import.meta.env.VITE_SN_USERNAME;
const SN_PASSWORD = import.meta.env.VITE_SN_PASSWORD;

export const servicenowAPI = axios.create({
  baseURL: `${SN_INSTANCE}/api/now/table`,
  auth: {
    username: SN_USERNAME,
    password: SN_PASSWORD,
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});
