import { TaskStatus } from "@prisma/client";

export default function getTaskStatusString(input: TaskStatus) {
  switch (input) {
    case TaskStatus.DONE:
      return "Done";
    case TaskStatus.IN_PROGRESS:
      return "In Progress";
    case TaskStatus.TODO:
      return "To Do";
  }
}
