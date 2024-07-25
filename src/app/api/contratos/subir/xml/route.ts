import { pool } from "@/libs/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { parseString } from "xml2js";
import path from "path";
import { writeFile, readFile } from "fs/promises";

export async function POST(request: any) {
  const cookieStore = cookies();
  const token: any = cookieStore.get("TokenLogin");

  const query: { id: number }[] = await pool.query(`SELECT id FROM contratos`);
  let queryres = 0;
  let itemId

  try {
    jwt.verify(token.value, "secret") as JwtPayload;

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json(
        {
          message: "Archivo no válido",
        },
        {
          status: 401,
        }
      );
    } else if (file.type !== "text/xml") {
      return NextResponse.json(
        {
          message: "Formato de archivo no válido. Se requiere un archivo XML.",
        },
        {
          status: 400,
        }
      );
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // Obtener la estampa de tiempo actual
    const timestamp = Date.now();
    // Modificar el nombre del archivo añadiendo la estampa de tiempo al inicio
    const modifiedFileName = `${timestamp.toString()}-${file.name}`;
    // Construir la ruta del archivo con el nuevo nombre
    const filePath = path.join(
      process.cwd(),
      "public/uploads/xml",
      modifiedFileName
    );
    await writeFile(filePath, buffer);
    console.log(
      `open ${filePath} to see the uploaded file ${modifiedFileName}`
    );
    const redFile = await readFile(filePath, { encoding: "utf8" });
    console.log("mi promesa");
    parseString(redFile, async (err: any, result: any) => {
      console.log(
        result.contratos.contrato[0].fecha_contrato,
        result.contratos.contrato[1].fecha_contrato
      );
      if (err) {
        console.error(err);
       queryres= 0
      }else{
        for (const item of query) {
          for (const contrato of result.contratos.contrato) {
            if (item.id == contrato.id[0]) {
              
            console.log(contrato.fecha_contrato[0]);
              console.log("ID duplicado encontrado");
              queryres = 2;
              itemId = item.id;
              console.log(itemId);
              break;
            } else {
              queryres = 1;              
            }
          }
          if (queryres == 2) {
            break;
          }
        }
        if (queryres==1){
          for (const contrato of result.contratos.contrato) {
            console.log (result.contratos.contrato.fecha_contrato)

            const xmldb = await pool.query(
              `INSERT INTO contratos (fecha_contrato, id, ci_cliente, estatus_, id_cuenta, plan_contratado, direccion_contrato, motivo_standby, fecha_instalacion, recursos_inventario_instalacion, observaciones_instalacion, contratista_asignado, telefono_cliente, nodo, empresa_contratista) VALUES ('${contrato.fecha_contrato}','${contrato.id}','${contrato.ci_cliente}','${contrato.estatus_}','${contrato.id_cuenta}','${contrato.plan_contratado}','${contrato.direccion_contrato}','${contrato.motivo_standby}','${contrato.fecha_instalacion}','${contrato.recursos_inventario_instalacion}','${contrato.observaciones_instalacion}','${contrato.contratista_asignado}','${contrato.telefono_cliente}','${contrato.nodo}','${contrato.empresa_contratista}') `
              
            );
            console.log(xmldb);
          }
        }
      }
      
    });
    if (queryres == 1) {
      return NextResponse.json(
        {
          message: "Archivo subido correctamente a la base de datos",
        },
        {
          status: 201,
        }
      );
    } else if (queryres == 2) {
      return NextResponse.json(
        {
          message: `ID ${itemId} ya existente en la base de datos`,
        },
        {
          status: 401,
        }
      );
    }else if (queryres == 0){
       return NextResponse.json(
         {
           message:
             "Error de Sintaxis en el archivo XML. Por favor, verifique la estructura del archivo.",
         },
         {
           status: 400,
         }
       );
    }
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
