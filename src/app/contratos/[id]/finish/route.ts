import { pool } from "../../../../libs/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: any, { params }: { params: { id: any } }) {
  const cookieStore = cookies();
  const token: any = cookieStore.get("TokenLogin");

  try {
    jwt.verify(token.value, "secret") as JwtPayload;
    const result: object[] = await pool.query(
      `UPDATE contratos SET estatus_ = '2' WHERE id = ${params.id}`
    );

    return NextResponse.json(
      { message: "Contrato FINALIZADO correctamente" },
      { status: 200 }
    );
  } catch (error) {
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
