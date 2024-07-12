import { pool } from "@/libs/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: any, { params }: { params: { id: any } }) {
    const { fecha_contrato, id, ci_cliente, estatus_, id_cuenta, plan_contratado, direccion_contrato, telefono_cliente, nodo, empresa_contratista } = await request.json();
  const cookieStore = cookies();
  const token: any = cookieStore.get("TokenLogin");

  try {
    jwt.verify(token.value, "secret") as JwtPayload;
    const result: object[] = await pool.query(
      `UPDATE contratos SET  WHERE id = ${params.id}`
    );

    return NextResponse.json(
      { message: "deleted succesfuly" },
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
