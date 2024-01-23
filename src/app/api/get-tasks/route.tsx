import { getPrismaClient } from "@/lib/helpers/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../(authentication)/auth/[...nextauth]/options";
import { NextResponse } from "next/server";

const prisma = getPrismaClient();

export async function GET() {
  let session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorised request." },
      { status: 401 }
    );
  }

  let tasksResponse = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },

    select: {
      tasks: {
        orderBy: {
          title: "desc",
        },
      },
    },
  });
  return NextResponse.json({ tasks: tasksResponse?.tasks });
}
