import { pool } from "@/libs/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: any, { params }: { params: { id: any } }) {
    const { fecha_contrato, id, ci_cliente, estatus_, id_cuenta, plan_contratado, telefono_cliente, nodo, empresa_contratista, fecha_instalacion, contratista_asignado } = await request.json();
    
  const cookieStore = cookies();
  const token: any = cookieStore.get("TokenLogin");

  try {
    jwt.verify(token.value, "secret") as JwtPayload;
    // Paso 1: Consulta previa para verificar si el id ya existe en otro registro
    const idCheck: object[]  = await pool.query(`
      SELECT * FROM contratos WHERE id='${id}';
    `);

    // Paso 2: Evaluación de la consulta
    if (idCheck.length > 0) {
      // Paso 3: Manejo de errores - id duplicado encontrado
        return NextResponse.json(
      { message: "ID ya existente" },
      { status: 401 })
    }

    // Paso 4: Creación del registro
  const result: object[] = await pool.query(`
      INSERT INTO contratos (id, fecha_instalacion, fecha_contrato, ci_cliente, estatus_, id_cuenta, plan_contratado, telefono_cliente, nodo, empresa_contratista, contratista_asignado) VALUES ('${id}', '${fecha_contrato}', '${fecha_instalacion}', '${ci_cliente}', '${estatus_}', '${id_cuenta}', '${plan_contratado}', '${telefono_cliente}', '${nodo}', '${empresa_contratista}', '${contratista_asignado}');
`);
    console.log("funciona bien ", result);

    return NextResponse.json(
      { message: "created succesfuly" },
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
