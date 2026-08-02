import { serverApi } from "@/libs/server-api";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json();

  const { data } = await serverApi.post(
    `${process.env.API_URL}/auth/login`,
    body,
  );

  (await cookies()).set("access_token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return Response.json(data.user);
}
