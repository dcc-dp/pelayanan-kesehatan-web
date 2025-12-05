import { NextResponse } from "next/server";
import pool from "../../../../../lib/mysql";


export async function GET(request, { params }) {
  const bookingsId = params.id; 

  try {
    const db = await pool.getConnection();

    const query = `
  SELECT 
  d.name AS obat, 
  d.price AS harga,
  dt.jumlah_minum, dt.jumlah_hari, dt.waktu_minum,
  pembeli.name as nm_pembeli,
  dokter.name as nm_dokter
FROM bookings b
INNER JOIN recipes r ON b.recipes_id = r.id
INNER JOIN details dt ON dt.recipes_id = r.id
INNER JOIN drugs d ON dt.drugs_id = d.id
INNER JOIN users pembeli ON r.users_id = pembeli.id
INNER JOIN doctor dr ON r.doctors_id = dr.id
INNER JOIN users dokter ON dr.users_id = dokter.id
where b.id = ?
`;  
    const [rows] = await db.execute(query, [bookings]);
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
