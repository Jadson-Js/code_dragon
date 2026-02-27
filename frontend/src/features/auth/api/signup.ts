import { api } from "@/lib/api-client";
import type { SignupValues } from "../schemas/signup-schema";

export async function API_SIGNUP(data: SignupValues) {
  const [day, month, year] = data.birthDate.split("/");
  const formattedData = {
    ...data,
    birthDate: `${year}-${month}-${day}`,
  };

  const response = await api.post("/auth/signup", formattedData);
  return response.data;
}
