import { NextResponse } from "next/server";
import { prisma } from "@/src/libs/prisma";

export async function GET(request, { params }) {
  const detailId = parseInt(params.id);

  try {
    const data = await prisma.details.findUnique({
      where: {
        id: detailId,
      },
    });

    if (!data) {
      return NextResponse.json(
        { message: "Tidak ada data detail untuk ID ini" },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
