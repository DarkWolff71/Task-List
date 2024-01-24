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

export default function Home() {
  let revalidateDataState = useRecoilValue(revalidateData);
  let [taskListState, setTaskListState] = useRecoilState(taskList);
  let [allTasksState, setAllTasksState] = useRecoilState(allTasks);
  let [tasksExistState, setTasksExistState] = useState(false);

  useEffect(() => {
    console.log("line 24");
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
