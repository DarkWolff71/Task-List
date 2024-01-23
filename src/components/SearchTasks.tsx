"use client";

import React, { useEffect } from "react";
import { FilterTaskByStatusDropdown } from "./FilterTaskByStatusdropdown";
import {
  filterTasksByStatus,
  taskList,
  taskListFilteredBySearch,
} from "@/recoil-store/atoms/taskList";
import { useRecoilState } from "recoil";
import { Task } from "@/types/response";

type Props = { tasks: Task[] };

export default function ({ tasks }: Props) {
  console.log("line 203: t: ", tasks);
  let [filteredTaskListState, setFilteredTaskListState] =
    useRecoilState(taskList);
  let [taskListFilteredBySearchState, setTaskListFilteredBySearchState] =
    useRecoilState(taskListFilteredBySearch);

  useEffect(() => {
    setTaskListFilteredBySearchState(tasks);
  }, [tasks]);

  let inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    if (inputValue) {
      console.log("line 29 s");

      const filteredTasks = tasks.filter(
        (task) =>
          task.title.includes(inputValue) ||
          task.description?.includes(inputValue)
      );
      setFilteredTaskListState(filteredTasks);
      setTaskListFilteredBySearchState(filteredTasks);
      console.log("line 32 s: ", filteredTasks);
    } else {
      console.log("line 37 s: ", tasks);
      setTaskListFilteredBySearchState(tasks);
      setFilteredTaskListState(tasks);

      console.log("line 42 s: ", taskListFilteredBySearchState);
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
