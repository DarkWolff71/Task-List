import React, { useRef, useState } from "react";
import { TaskStatusDropdown } from "./TaskStatusDropdown";
import { cn } from "@/lib/helpers/utils";

export default function EditTaskCard() {
  let titleInputRef = useRef<HTMLTextAreaElement | null>(null);
  let descriptionInputRef = useRef<HTMLTextAreaElement | null>(null);
  let [isInvalidTitleState, setIsInvalidTitleState] = useState(false);

  return (
    <div>
      <div className="flex">
        <div className="flex-grow">
          <textarea
            rows={1}
            ref={titleInputRef}
            className={cn(
              "block p-2.5 w-full flex-grow text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
              { "dark:border-red-700 border-red-700": isInvalidTitleState }
            )}
            placeholder="Your task's title goes here..."
          ></textarea>
        </div>
        <TaskStatusDropdown></TaskStatusDropdown>
      </div>
      <div>
        <textarea
          ref={descriptionInputRef}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 flex-1"
          placeholder="Your task's description goes here..."
        ></textarea>
      </div>
    </div>
  );
}
