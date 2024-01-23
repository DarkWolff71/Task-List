import { TaskStatus } from "@prisma/client";
import { atom } from "recoil";

type Task = {
  id: string;
  title: string;
  createdOn: string;
  description?: string;
  status: TaskStatus;
};

export const revalidateData = atom<boolean>({
  key: "revalidateData",
  default: false,
});

export const taskList = atom<Task[]>({
  key: "taskList",
  default: [],
});

export const allTasks = atom<Task[]>({
  key: "allTasks",
  default: [],
});

export const taskListFilteredBySearch = atom<Task[]>({
  key: "taskListFilteredBySearch",
  default: [],
});

export const filterTasksByStatus = atom<TaskStatus | "ALL-TASKS">({
  key: "filterTasksByStatus",
  default: "ALL-TASKS",
});
