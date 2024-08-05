import { pool } from "../../../../libs/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request:any) {
  const cookieStore = cookies();
  const token: any = cookieStore.get("TokenLogin");

    const deletingRows = await request.json()
  try {
    jwt.verify(token.value, "secret") as JwtPayload;
    const result: object[] = await pool.query(
      `DELETE FROM contratos WHERE id IN (${deletingRows})`
    );
    console.log(result)
    return NextResponse.json(
      { message: `Se han eliminado ${deletingRows.length} contratos` },
      { status: 200 }
    );
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        message: "Invalid credentials",
      },
      {
        status: 401,
      }
    );
  }
}
