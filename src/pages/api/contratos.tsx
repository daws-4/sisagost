import { pool } from "../../libs/db.js";
import { NextApiRequest, NextApiResponse } from 'next';

export default async function Contratos(req: NextApiRequest, res: NextApiResponse) {

const result: object[] = await pool.query("SELECT * FROM contratos");

return (res.json(result));
}