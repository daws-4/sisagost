import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { pool } from "../../../../libs/db";
import bcrypt from "bcryptjs";

export async function POST(request:any) {
  const { email, contraseña } = await request.json();
  const results:any =  await pool.query(`SELECT * FROM administradores WHERE email = '${email}'`);
  if (
    results.length == 0 ||
    !(await bcrypt.compare(contraseña, results[0].contraseña))
  ) {
    return NextResponse.json(
      {
        message: "Invalid credentials",
      },
      {
        status: 401,
      }
    );
  } else {
    const token = sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        email: results[0].email,
        rol: results[0].rol,
        contratista: results[0].contratista,
        nombres: results[0].Nombres,
        apellidos: results[0].Apellidos,
        n_telefono: results[0].n_telefono,
      },
      "secret"
    );

    const response = NextResponse.json({
      token, message: "Login successful",
    });

    response.cookies.set({
      name: "TokenLogin",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60,
      path: "/",
    });

    return response;
  }


}
