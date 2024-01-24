"use client";

import { AddTask } from "@/components/AddTask";
import { BASE_URL } from "../config/URL";
import axios from "axios";
import { TaskCard } from "@/components/TaskCard";
import SearchTasks from "@/components/SearchTasks";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  taskList,
  allTasks,
  revalidateData,
} from "@/recoil-store/atoms/taskList";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/shadcn/ui/sheet";
import MenuIcon from "@mui/icons-material/Menu";
import { signOut, useSession } from "next-auth/react";
import { Avatar, Button } from "@nextui-org/react";

export default function Home() {
  let revalidateDataState = useRecoilValue(revalidateData);
  let [taskListState, setTaskListState] = useRecoilState(taskList);
  let [allTasksState, setAllTasksState] = useRecoilState(allTasks);
  let [tasksExistState, setTasksExistState] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    async function getTasks() {
      const {
        data: { tasks },
      } = await axios.get(`${BASE_URL}/api/get-tasks`);
      if (tasks.length > 0) {
        setTasksExistState(true);
      }
      setTaskListState(tasks);
      setAllTasksState(tasks);
    }
    getTasks();
  }, [revalidateDataState]);

  return (
    <>
      <Sheet>
        <div className="flex w-full">
          <div className="flex-grow flex items-center justify-center">
            <div className="text-3xl font-bold dark:text-white font-mono ml-8">
              Task List
            </div>
          </div>
          <div className="mr-2">
            <SheetTrigger>
              <MenuIcon />
            </SheetTrigger>
          </div>
        </div>
        <SheetContent className="dark:border-gray-800">
          <SheetDescription>
            <div className="flex mt-2 gap-3 items-center">
              <div>
                <Avatar src={session?.user?.image || ""} />
              </div>
              <div>{session?.user?.name}</div>
            </div>
            <div className="flex items-center justify-center mt-4">
              <Button onClick={() => signOut()}>Signout</Button>
            </div>
          </SheetDescription>
        </SheetContent>
      </Sheet>
      <div className="flex-col items-center justify-center gap-2">
        <AddTask></AddTask>
        {!tasksExistState ? null : (
          <div className="m-2 p-4 pt-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 ">
            <div className="flex items-center justify-center">
              <h4 className="text-2xl font-bold dark:text-white">Your Tasks</h4>
            </div>
            <div className="mt-2">
              <SearchTasks tasks={allTasksState}></SearchTasks>
            </div>
            <div className="mt-2 space-y-4">
              {taskListState.map((task) => {
                const props = {
                  id: task.id,
                  title: task.title,
                  status: task.status,
                  createdOn: task.createdOn,

                  description: task.description,
                };

                return <TaskCard {...props} key={task.id} />;
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
