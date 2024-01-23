import { getPrismaClient } from "@/lib/helpers/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../(authentication)/auth/[...nextauth]/options";
import { editTaskRequestValidator } from "@/validators/request/editTask";

const prisma = getPrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorised request." },
      { status: 401 }
    );
  }

  const validatedRequest = editTaskRequestValidator.safeParse(await req.json());
  if (!validatedRequest.success) {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const validTaskId = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      _count: {
        select: {
          tasks: {
            where: {
              id: validatedRequest.data.id,
            },
          },
        },
      },
    },
  });
  if (validTaskId?._count.tasks === 0) {
    return NextResponse.json(
      { error: "The user does not have any task with the specified id." },
      { status: 403 }
    );
  }

  const { id: taskId, status, description, title } = validatedRequest.data;
  await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      ...(status && { status }),
      ...(description && { description }),
      ...(title && { title }),
    },
  });

  return NextResponse.json({ message: "Successfully updated the task." });
}
