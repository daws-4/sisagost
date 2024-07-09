import { pool } from "../../../libs/db.js";
import { NextResponse } from 'next/server'
 
export async function GET() {
  const result: object[] = await pool.query("SELECT * FROM contratos");

  return NextResponse.json(result);
}
