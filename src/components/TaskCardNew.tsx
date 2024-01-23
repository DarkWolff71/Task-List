"use client";

import { TaskStatus } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import getTaskStatusString from "@/lib/helpers/taskStatusString";
import { cn } from "@/lib/helpers/utils";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { BASE_URL } from "@/config/URL";
import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import { allTasks, revalidateData } from "@/recoil-store/atoms/taskList";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

type Props = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdOn: string;
};

export function TaskCardNew({ title, description, status, id }: Props) {
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onOpenChange: onModalOpenChange,
  } = useDisclosure();
  let [inEditModeState, setInEditModeState] = useState(false);
  let [isSaving, setIsSaving] = useState(false);
  let [isDeleting, setIsDeleting] = useState(false);
  let titleInputRef = useRef<HTMLTextAreaElement | null>(null);
  let descriptionInputRef = useRef<HTMLTextAreaElement | null>(null);
  let [isInvalidTitleState, setIsInvalidTitleState] = useState(false);
  let setRevalidatDataState = useSetRecoilState(revalidateData);
  let [allTasksState, setAllTasksState] = useRecoilState(allTasks);
  const router = useRouter();

  const [selectedStatusKeys, setSelectedStatusKeys] = React.useState<
    Set<string>
  >(new Set([status]));

  // const selectedStatusValue = React.useMemo(() => {
  //   return Array.from(selectedStatusKeys).join(", ");
  // }, [selectedStatusKeys]);
  let [selectedStatusValue, setSelectedStatusValue] =
    useState<TaskStatus>(status);

  function handleCancelEdit() {
    setInEditModeState(false);
  }

  function handleEditTask() {
    setInEditModeState(true);
    if (description && descriptionInputRef.current) {
      descriptionInputRef.current.value = description;
    }
    if (titleInputRef.current) {
      titleInputRef.current.value = title;
    }
  }

  useEffect(() => {
    if (inEditModeState && description && descriptionInputRef.current) {
      descriptionInputRef.current.value = description;
    }
    if (inEditModeState && titleInputRef.current) {
      titleInputRef.current.value = title;
    }
  }, [inEditModeState]);

  async function handleDeleteTask(onClose: () => void) {
    setIsDeleting(true);
    await axios.delete(`${BASE_URL}/api/delete-task`, {
      params: {
        taskId: id,
      },
    });
    setIsDeleting(false);
    onClose();
    setRevalidatDataState((state) => !state);
    // router.refresh();
  }

  async function handleSave() {
    setIsSaving(true);
    console.log(titleInputRef.current?.value);
    if (!titleInputRef.current?.value) {
      setIsInvalidTitleState(true);
      return;
    }
    await axios.post(`${BASE_URL}/api/edit-task`, {
      id: id,
      title: titleInputRef.current?.value,
      description: descriptionInputRef.current?.value,
      status: selectedStatusValue,
    });
    if (isInvalidTitleState) {
      setIsInvalidTitleState(false);
    }
    setIsSaving(false);
    setAllTasksState((tasks) =>
      tasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            title: titleInputRef.current?.value || "",
            description: descriptionInputRef.current?.value,
            status: selectedStatusValue as TaskStatus,
          };
        }
        return task;
      })
    );
    setRevalidatDataState((state) => !state);
  }

  return (
    <>
      <div className="flex space-x-2">
        {inEditModeState ? (
          <>
            <>
              <div className="flex w-full space-x-2">
                <div className=" flex-grow space-y-1">
                  <div>
                    <p
                      className={cn("text-red-700 text-xs pl-2", {
                        hidden: !isInvalidTitleState,
                      })}
                    >
                      Title cannot be empty
                    </p>
                    <div className="flex w-full space-x-2">
                      <div className="flex space-x-2 w-full">
                        <textarea
                          rows={1}
                          ref={titleInputRef}
                          className={cn(
                            "block p-2.5 w-full flex-grow text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                            {
                              "dark:border-red-700 border-red-700":
                                isInvalidTitleState,
                            }
                          )}
                          placeholder="Your task's title goes here..."
                        ></textarea>
                      </div>
                      <div className="flex-shrink-0 items-center justify-center">
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              variant="bordered"
                              className="bg-gray-50 dark:bg-gray-800"
                            >
                              {getTaskStatusString(
                                selectedStatusValue as TaskStatus
                              )}
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Static Actions"
                            disallowEmptySelection
                            selectionMode="single"
                            selectedKeys={selectedStatusKeys}
                            onSelectionChange={(status) => {
                              console.log(Array.from(status)[0]);

                              setSelectedStatusValue(
                                Array.from(status)[0] as TaskStatus
                              );
                              // setSelectedStatusKeys(new Set(x as string));
                            }}
                          >
                            {/* <DropdownItem key={TaskStatus.TODO}>
                            {getTaskStatusString(TaskStatus.TODO)}
                          </DropdownItem>
                          <DropdownItem key={TaskStatus.IN_PROGRESS}>
                            {getTaskStatusString(TaskStatus.IN_PROGRESS)}
                          </DropdownItem>
                          <DropdownItem key={TaskStatus.DONE}>
                            {getTaskStatusString(TaskStatus.DONE)}
                          </DropdownItem> */}
                            {Object.values(TaskStatus).map((value, index) => (
                              <DropdownItem key={value}>
                                {getTaskStatusString(value as TaskStatus)}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                  <div>
                    <textarea
                      ref={descriptionInputRef}
                      rows={2}
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 flex-1"
                      placeholder="Your task's description goes here..."
                    ></textarea>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                  <Button onClick={handleCancelEdit}>Cancel</Button>
                  <Button onClick={handleSave}>Save</Button>
                </div>
              </div>
            </>
          </>
        ) : (
          <>
            <div className="flex-grow flex-col">
              <div>
                <div
                  className={cn("p-[1px] rounded-full", {
                    "bg-gradient-to-r from-red-500  to-yellow-500 ":
                      status == TaskStatus.TODO,
                    "bg-gradient-to-r from-sky-400 to-blue-500":
                      status == TaskStatus.IN_PROGRESS,
                    "bg-gradient-to-r from-emerald-500 to-lime-600":
                      status == TaskStatus.DONE,
                  })}
                >
                  <div className="flex h-full w-full rounded-full pl-3 gap-2 text-lg text-gray-500 md:text-xl dark:text-gray-400 bg-white dark:bg-gray-700">
                    <div
                      className="flex-grow "
                      style={{ overflowWrap: "anywhere" }}
                    >
                      {title}
                    </div>

                    <p
                      className={cn(
                        "flex-shrink-0 rounded-full px-2 text-white ",
                        {
                          "bg-gradient-to-r from-red-500  to-yellow-500 ":
                            status == TaskStatus.TODO,
                          "bg-gradient-to-r from-sky-400 to-blue-500":
                            status == TaskStatus.IN_PROGRESS,
                          "bg-gradient-to-r from-emerald-500 to-lime-600":
                            status == TaskStatus.DONE,
                        }
                      )}
                    >
                      {getTaskStatusString(status)}
                    </p>
                  </div>
                </div>
              </div>
              {!description ? null : (
                <div
                  className={cn("p-[1px] rounded-md z-10 mt-[-1px] border-0 ", {
                    "bg-gradient-to-r from-red-500  to-yellow-500 ":
                      status == TaskStatus.TODO,
                    "bg-gradient-to-r from-sky-400 to-blue-500":
                      status == TaskStatus.IN_PROGRESS,
                    "bg-gradient-to-r from-emerald-500 to-lime-600":
                      status == TaskStatus.DONE,
                  })}
                >
                  <div
                    className="flex h-full w-full rounded-md px-2 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700"
                    style={{ overflowWrap: "anywhere" }}
                  >
                    {description}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center space-x-2">
              <button onClick={handleEditTask} className="">
                <EditIcon></EditIcon>
              </button>
              <button onClick={onModalOpen}>
                <DeleteForeverIcon></DeleteForeverIcon>
              </button>
              <Modal isOpen={isModalOpen} onOpenChange={onModalOpenChange}>
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Are you sure want to delete the task?
                      </ModalHeader>
                      <ModalBody>
                        <div className="space-y-2">
                          <div>
                            <p>Title:</p>
                            <p className="text-gray-500 dark:text-gray-400">
                              {title}
                            </p>
                          </div>
                          {description ? (
                            <div>
                              <p>Description: </p>
                              <p className="text-gray-500 dark:text-gray-400">
                                {description}
                              </p>
                            </div>
                          ) : null}
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          isLoading={isDeleting}
                          onPress={() => {
                            handleDeleteTask(onClose);
                          }}
                        >
                          Continue
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </div>
          </>
        )}
      </div>
    </>
  );
}
