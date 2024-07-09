import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


import { NextApiRequest } from "next";

export function GET(request: NextApiRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("TokenLogin");

  if (!token) {
   return NextResponse.json(
     {
       message: "Invalid credentials",
     },
     {
       status: 401,
     }
   );
  }else{
    const { email, rol, contratista, nombres, apellidos, n_telefono } = jwt.verify(
    token.value,
    "secret"
  ) as JwtPayload;

  return NextResponse.json({
    email,
    rol,
    contratista,
    nombres,
    apellidos,
    n_telefono,
  });}

  
}
