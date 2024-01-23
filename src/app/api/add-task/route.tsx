import { getPrismaClient } from "@/lib/helpers/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../(authentication)/auth/[...nextauth]/options";
import { addTaskRequestValidator } from "@/validators/request/addTask";

const prisma = getPrismaClient();

export async function POST(req: NextRequest) {
  let session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorised request." },
      { status: 401 }
    );
  }

  const validatedRequest = addTaskRequestValidator.safeParse(await req.json());
  if (!validatedRequest.success) {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const { title, description, status } = validatedRequest.data;
  await prisma.task.create({
    data: {
      title: title,
      status: status,
      ...(description && { description }),
      user: {
        connect: {
          email: session.user.email,
        },
      },
    },
  });

  return NextResponse.json({ message: "Successfully created the task." });
}
