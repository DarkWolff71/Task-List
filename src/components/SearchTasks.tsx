"use client";

import React, { useEffect } from "react";
import { FilterTaskByStatusDropdown } from "./FilterTaskByStatusdropdown";
import {
  taskList,
  taskListFilteredBySearch,
} from "@/recoil-store/atoms/taskList";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Task } from "@/types/response";

type Props = { tasks: Task[] };

export default function ({ tasks }: Props) {
  let setFilteredTaskListState = useSetRecoilState(taskList);
  let [taskListFilteredBySearchState, setTaskListFilteredBySearchState] =
    useRecoilState(taskListFilteredBySearch);

  useEffect(() => {
    setTaskListFilteredBySearchState(tasks);
  }, [tasks]);

  let inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    if (inputValue) {
      const filteredTasks = tasks.filter(
        (task) =>
          task.title.includes(inputValue) ||
          task.description?.includes(inputValue)
      );
      setFilteredTaskListState(filteredTasks);
      setTaskListFilteredBySearchState(filteredTasks);
    } else {
      setTaskListFilteredBySearchState(tasks);
      setFilteredTaskListState(tasks);
    }
  };

  return (
    <div className="flex space-x-4">
      <input
        type="search"
        className="w-full bg-slate-400 dark:bg-black rounded-lg mb-2 dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 focus:border-blue-500 dark:border-slate-700 flex-grow border-2"
        placeholder="Search tasks..."
        onChange={inputChangeHandler}
      ></input>
      <div className="flex items-center justify-center">
        <p className="mr-1">Filter: </p>
        <FilterTaskByStatusDropdown
          tasks={taskListFilteredBySearchState}
        ></FilterTaskByStatusDropdown>
      </div>
    </div>
  );
}
