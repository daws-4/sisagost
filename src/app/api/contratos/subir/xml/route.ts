import { pool } from "@/libs/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { parseString } from "xml2js";
import { promises as fs } from "fs";
import path from "path";
import { writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import multer from "multer";

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(CURRENT_DIR, "../");
const MIMETYPES = ["text/xml"];

const multerUpload = multer({
  storage: multer.diskStorage({
    destination: path.join(process.cwd(), "public/uploads/xml"),
    filename: (req, file, cb) => {
      const fileExtension = path.extname(file.originalname);
      const fileName = file.originalname.split(fileExtension)[0];

      cb(null, `${fileName}-${Date.now()}${fileExtension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (MIMETYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`Only ${MIMETYPES.join(" ")} mimetypes are allowed`));
  },
  limits: {
    fieldSize: 100000000,
  },
});

export async function POST(request: any) {


    const cookieStore = cookies();
  const token: any = cookieStore.get("TokenLogin");

  try {
    jwt.verify(token.value, "secret") as JwtPayload;

    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false });
    }
  multerUpload.single("file");

  return NextResponse.json({ success: true });
  } catch(  error){
    console.log(error)
      return NextResponse.json(
        {
          message: "Invalid credentials",
        },
        {
          status: 401,
        })
    }

}
