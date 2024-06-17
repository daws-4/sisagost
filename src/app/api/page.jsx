import { NextResponse } from "next/server";
import { pool } from "../../libs/db.js";
import {  MiComponente  } from '../../components/ui/index';

export default async function GET() {
  const result = await pool.query("SELECT NOW()");

  let now = new Date(result[0]['NOW()'])

  console.log(now.toString())

  return(
    <div>
    <MiComponente />
    <h1>hola mundo {now.toLocaleDateString('es-ES', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</h1>
    </div>
) 
}

