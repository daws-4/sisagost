import { pool } from "../../../libs/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from 'next/server'
 
export async function GET() {
   const cookieStore = cookies();
   const token: any = cookieStore.get("TokenLogin");

  try{
    jwt.verify(token.value, "secret") as JwtPayload;
  const result: object[] = await pool.query("SELECT * FROM empresas");

  return NextResponse.json(result);
  }catch(error){
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
