import { TaskStatus } from "@prisma/client";

export interface Task {
  id: string;
  createdOn: string;
  title: string;
  description?: string;
  status: TaskStatus;
}
