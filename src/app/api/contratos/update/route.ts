import { pool } from "../../../../libs/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: any) {
  const cookieStore = cookies();
  const token: any = cookieStore.get("TokenLogin");

  const{ updatingRows, instaladorAsig} = await request.json();;
  try {
    jwt.verify(token.value, "secret") as JwtPayload;
    const result: object[] = await pool.query(
      `UPDATE contratos SET contratista_asignado = '${instaladorAsig}' WHERE id IN (${updatingRows})`
    );
    console.log(result);
    return NextResponse.json(
      { message: `Se han asignado ${updatingRows.length} contratos al instalador ${instaladorAsig}` },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
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
