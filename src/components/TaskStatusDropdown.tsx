import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { TaskStatus } from "@prisma/client";
import getTaskStatusString from "@/lib/helpers/taskStatusString";
import { useRecoilState } from "recoil";
import { status } from "@/recoil-store/atoms/addTask";

export function TaskStatusDropdown() {
  let [addTaskStatusValue, setAddTaskStatusValue] = useRecoilState(status);
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
    new Set([TaskStatus.TODO])
  );

  const selectedValue = React.useMemo(() => {
    const selectedStatus = Array.from(selectedKeys).join(", ");
    setAddTaskStatusValue(selectedStatus as TaskStatus);
    return selectedStatus;
  }, [selectedKeys]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" className="bg-gray-50 dark:bg-gray-800">
          {getTaskStatusString(selectedValue as TaskStatus)}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Static Actions"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={(x) => {
          setSelectedKeys(new Set(x as string));
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
  );
}
