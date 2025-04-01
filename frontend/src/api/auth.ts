import { User } from "../types/User";
import api from "./axiosInstance";


export const login = async (data: { email: string; password: string }) => {
  try {
    const res = await api.post("/auth/login", data);
    return res.data.token;
  } catch (err) {
    console.error(err);
    throw new Error("Login failed");
  }
};

export const register = async (user: User) => {
  await api.post("/auth/register", user);
};
