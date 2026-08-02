import axios from "axios";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();

  const { data } = await axios.post(`${process.env.API_URL}/auth/login`, body);

  (await cookies()).set("access_token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return Response.json(data.user);
}
