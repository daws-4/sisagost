import { pool } from "@/libs/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: any, { params }: { params: { id: any } }) {
    const { fecha_contrato, id, ci_cliente, estatus_, id_cuenta, plan_contratado, telefono_cliente, nodo, empresa_contratista, fecha_instalacion } = await request.json();
    
  const cookieStore = cookies();
  const token: any = cookieStore.get("TokenLogin");
  console.log('funcionaaa ',id, fecha_contrato, ci_cliente, estatus_, id_cuenta, plan_contratado, telefono_cliente, nodo, empresa_contratista, fecha_instalacion)

  try {
    jwt.verify(token.value, "secret") as JwtPayload;
    // Paso 1: Consulta previa para verificar si el id ya existe en otro registro
    const idCheck: object[]  = await pool.query(`
      SELECT * FROM contratos WHERE id='${id}' AND id != '${params.id}';
    `);

    // Paso 2: Evaluación de la consulta
    if (idCheck.length > 0) {
      // Paso 3: Manejo de errores - id duplicado encontrado
        return NextResponse.json(
      { message: "ID ya existente" },
      { status: 401 })
    }

    // Paso 4: Actualización del registro
    const result: object[] = await pool.query(`
      UPDATE contratos SET id='${id}', fecha_instalacion = '${fecha_instalacion}', fecha_contrato = '${fecha_contrato}', ci_cliente = '${ci_cliente}', estatus_ = '${estatus_}', id_cuenta = '${id_cuenta}', plan_contratado = '${plan_contratado}', telefono_cliente = '${telefono_cliente}', nodo = '${nodo}', empresa_contratista = '${empresa_contratista}' WHERE id = '${params.id}';
    `);
    console.log("funciona bien ", result);

    return NextResponse.json(
      { message: "updated succesfuly" },
      { status: 200 }
    );
  } catch (error) {
    console.log('algo falló', error)
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
