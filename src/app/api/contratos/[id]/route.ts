import { pool } from "../../../../libs/db.js";
import { NextResponse } from 'next/server'

export async function GET(req: any, {params} : { params: {id:any}}) {

  const result: object[] = await pool.query(
    `SELECT * FROM contratos WHERE id = ${params.id}`
  );

  return NextResponse.json(result);
}
