import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../(authentication)/auth/[...nextauth]/options";
import { getPrismaClient } from "@/lib/helpers/prisma";
import { revalidatePath } from "next/cache";

const prisma = getPrismaClient();

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorised request." },
      { status: 401 }
    );
  }

  const taskId = req.nextUrl.searchParams.get("taskId");
  if (!taskId) {
    return NextResponse.json(
      { error: "Bad request. Invalid task id." },
      { status: 400 }
    );
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
              id: taskId,
            },
          },
        },
      },
    },
  });

  if (validTaskId?._count.tasks === 0) {
    console.log("title 4222");
    return NextResponse.json(
      { error: "The user does not have any task with the specified id." },
      { status: 403 }
    );
  }

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });
  return NextResponse.json({ message: "Successfully deleted the task." });
}
