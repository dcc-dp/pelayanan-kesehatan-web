import { NextResponse } from "next/server";
import pool from "@/libs/mysql";

export async function GET(request, { params }) {
  const details = params.id; // user id

  try {
    const db = await pool.getConnection();

    const query = `
    SELECT 
      d.id,
      d.jumlah_minum,
      d.jumlah_hari,
      d.waktu_minum,
      dr.name AS nama_drug,
      re.users_id,
      re.doctors_id
      FROM details AS d
      INNER JOIN drugs AS dr ON d.drugs_id = dr.id
      INNER JOIN recipes AS re ON d.recipes_id = re.id
      WHERE d.id = ?
    `;
    const [rows] = await db.execute(query, [details]);
    db.release();

    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
