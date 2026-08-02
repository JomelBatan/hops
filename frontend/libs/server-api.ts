import axios from "axios";

export const serverApi = axios.create({
  baseURL: "/api",
});
