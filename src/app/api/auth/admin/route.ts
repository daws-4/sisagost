import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function GET() {
  const cookieStore = cookies();
  const token:any = cookieStore.get("TokenLogin");

  try{
    const { email, rol, contratista, nombres, apellidos, n_telefono } =
      jwt.verify(token.value, "secret") as JwtPayload;

    return NextResponse.json({
      email,
      rol,
      contratista,
      nombres,
      apellidos,
      n_telefono,
    });
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
