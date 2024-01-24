"use client";

import React, { useRef, useState } from "react";
import { FullWidthBg } from "./FullWidthBg";
import { Button } from "@nextui-org/react";
import { cn } from "@/lib/helpers/utils";
import axios from "axios";
import { BASE_URL } from "@/config/URL";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { status } from "@/recoil-store/atoms/addTask";
import { TaskStatusDropdown } from "./TaskStatusDropdown";
import { revalidateData } from "@/recoil-store/atoms/taskList";
import toast from "react-hot-toast";

export function AddTask() {
  let titleInputRef = useRef<HTMLTextAreaElement | null>(null);
  let descriptionInputRef = useRef<HTMLTextAreaElement | null>(null);
  let setRevalidatDataState = useSetRecoilState(revalidateData);
  let [isInvalidTitleState, setIsInvalidTitleState] = useState(false);
  let addTaskStatusValue = useRecoilValue(status);
  let [isSaving, setIsSaving] = useState(false);

  async function handleSave(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    e.stopPropagation();
    setIsSaving(true);
    const titleValue = titleInputRef.current?.value;
    if (!titleValue) {
      setIsInvalidTitleState(true);
      return;
    }
    const descriptionValue = descriptionInputRef.current?.value;

    try {
      await axios.post(`${BASE_URL}/api/add-task`, {
        title: titleValue,
        status: addTaskStatusValue,
        ...(descriptionValue && { description: descriptionValue }),
      });
      toast.success("Task added successfully!");
      setRevalidatDataState((state) => !state);
    } catch (error) {
      toast.error("Failed to add task! Please retry again.");
    }
    setIsSaving(false);
  }

  return (
    <>
      <div className="m-2 p-4 pt-2 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 flex-grow">
        <div className="flex items-center justify-center">
          <h4 className="text-2xl font-bold dark:text-white mb-1 mt-[-3] pt-[-3]">
            Add Task
          </h4>
        </div>
        <div className="grid grid-cols-[5fr,1fr] space-x-4">
          <div className="flex flex-col">
            <FullWidthBg className="p-3">
              <label
                htmlFor="task-title"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-200"
              >
                Title:
              </label>
              <p
                className={cn("text-red-700 text-xs pl-2", {
                  hidden: !isInvalidTitleState,
                })}
              >
                Title cannot be empty
              </p>
              <textarea
                id="task-title"
                rows={1}
                ref={titleInputRef}
                className={cn(
                  "block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                  { "dark:border-red-700 border-red-700": isInvalidTitleState }
                )}
                placeholder="Your task's title goes here..."
              ></textarea>
            </FullWidthBg>
            <FullWidthBg className="mt-4 p-3 flex-1 flex flex-col">
              <label
                htmlFor="task-description"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-200"
              >
                Description:
              </label>
              <textarea
                id="task-description"
                ref={descriptionInputRef}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 flex-1"
                placeholder="Your task's description goes here..."
              ></textarea>
            </FullWidthBg>
          </div>
          <div className="flex flex-col">
            <div className="space-y-4 flex-grow">
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="task-status"
                  className=" block text-lg font-medium text-gray-900 dark:text-gray-200"
                >
                  Status:
                </label>
                <TaskStatusDropdown></TaskStatusDropdown>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Button
                onClick={handleSave}
                isLoading={isSaving}
                className="w-full"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
