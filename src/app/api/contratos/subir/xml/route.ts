import { pool } from "@/libs/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import xml2js from "xml2js";
import { promises as fs } from "fs";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "url";
import multer from "multer";



export async function POST(request: any) {




const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(CURRENT_DIR, "../");
const MIMETYPES = ["text/xml"];

const multerUpload = multer({
  storage: multer.diskStorage({
    destination: join(CURRENT_DIR, "../uploads"),
    filename: (req, file, cb) => {
      const fileExtension = extname(file.originalname);
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


var parser = new xml2js.Parser();
  fs.readFile(
    ROOT_DIR + `./uploads/${req.file.filename}`,
    function (err, data) {
      if (err) {
        console.log(err);
      } else {
        parser.parseString(data, function (err, result))}})
  // A partir de aquí, puedes continuar con la lógica de tu aplicación,
  // como verificar el token y realizar operaciones de base de datos.
  // Asegúrate de adaptar el código para usar los datos obtenidos del XML.
}
