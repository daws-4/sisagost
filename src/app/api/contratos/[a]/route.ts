import { pool } from "../../../../libs/db.js";
import { NextResponse } from 'next/server'
 
export async function GET({ params }: { params: { a: string } }) {
  try {
    console.log(params);
  } catch (error) {
    console.log(error);
  }
  const result: object[] = await pool.query(
    `SELECT * FROM contratos WHERE id = 1`
  );

  return NextResponse.json(result);
}
