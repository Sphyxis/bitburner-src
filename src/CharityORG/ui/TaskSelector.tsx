/**
 * React Component for the middle part of the charity memeber acordion. Contains
 * the task selector as well as some stats.
 */
import React, { useState } from "react";
import { useCharityORG } from "./Context";
import { TaskDescription } from "./TaskDescription";

import { Box } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { CharityVolunteerTasks } from "../CharityVolunteerTasks";
import { CharityEventTasks } from "../CharityORG";
import { CharityVolunteer } from "../CharityVolunteer";

interface IProps {
  member: CharityVolunteer;
  onTaskChange: () => void;
}

export function TaskSelector(props: IProps): React.ReactElement {
  const charityORG = useCharityORG();
  const [currentTask, setCurrentTask] = useState(props.member.task);

  const contextMember = charityORG.volunteers.find((member) => member.name == props.member.name);
  if (contextMember && contextMember.task != currentTask) {
    setCurrentTask(contextMember.task);
  }

  function onChange(event: SelectChangeEvent): void {
    const task = event.target.value;
    props.member.assignToTask(task);
    setCurrentTask(task);
    props.onTaskChange();
  }

  const tasks = charityORG.getAllTaskNames();

  return (
    <Box>
      <Select onChange={onChange} value={currentTask} sx={{ width: "100%" }}>
        <MenuItem key={0} value={"Unassigned"}>
          Unassigned
        </MenuItem>
        {tasks.map((task: string, i: number) => (
          <MenuItem key={i + 1} value={task}>
            {CharityVolunteerTasks[task]?.short_name.substring(0, 40)}
            {CharityEventTasks[task]?.short_name.substring(0, 40)}
          </MenuItem>
        ))}
      </Select>
      <TaskDescription member={props.member} />
    </Box>
  );
}