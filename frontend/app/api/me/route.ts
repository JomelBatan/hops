import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = (await cookies()).get("access_token")?.value;
  const { data } = await axios.get(`${process.env.API_URL}/auth/me`, {
    headers: {
      Cookie: `access_token=${token}`,
    },
  });

  return NextResponse.json(data.user);
}
