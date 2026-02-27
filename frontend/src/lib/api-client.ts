import axios from "axios";
import { env } from "@/shared/environments";

export const api = axios.create({
  baseURL: env.serverUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
