import { TaskStatus } from "@prisma/client";
import { atom } from "recoil";

export const status = atom<TaskStatus>({
  key: "addTaskStatus",
  default: TaskStatus.TODO,
});
