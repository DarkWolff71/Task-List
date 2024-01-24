import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { TaskStatus } from "@prisma/client";
import getTaskStatusString from "@/lib/helpers/taskStatusString";
import { useSetRecoilState } from "recoil";
import { filterTasksByStatus, taskList } from "@/recoil-store/atoms/taskList";
import { Task } from "@/types/response";

type Props = { tasks: Task[] };

export function FilterTaskByStatusDropdown({ tasks }: Props) {
  let setTaskStatusFilterState = useSetRecoilState(filterTasksByStatus);
  let setFilteredTaskListState = useSetRecoilState(taskList);

  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
    new Set(["ALL-TASKS"])
  );

  const selectedValue = React.useMemo(() => {
    const selectedStatus = Array.from(selectedKeys).join(", ");
    setTaskStatusFilterState(selectedStatus as TaskStatus);
    if (selectedStatus === "ALL-TASKS") {
      setFilteredTaskListState(tasks);
    } else {
      setFilteredTaskListState(
        tasks.filter((task) => task.status === selectedStatus)
      );
    }
    return selectedStatus;
  }, [selectedKeys, tasks]);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" className="w-24 bg-gray-50 dark:bg-gray-800">
          {selectedValue == "ALL-TASKS"
            ? "All Tasks"
            : getTaskStatusString(selectedValue as TaskStatus)}
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
        {[
          <DropdownItem key={"ALL-TASKS"}>{"All Tasks"}</DropdownItem>,
          //@ts-ignore
          Object.values(TaskStatus).map((value, index) => (
            <DropdownItem key={value}>
              {getTaskStatusString(value as TaskStatus)}
            </DropdownItem>
          )),
        ]}
      </DropdownMenu>
    </Dropdown>
  );
}
