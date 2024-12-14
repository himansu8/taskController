import axios from "axios";
import React, { useState } from "react";
import { Button, Modal, Stack } from "react-bootstrap";
import toast from "react-hot-toast";

function UpdateTask({ showUpdateModal, handleUpdateModalClose, id, setTasks, taskName, deadline, priority, startDate }) {
  const [data, setData] = useState({
    updateTaskName: taskName || "", 
    taskDeadLine: deadline || "", 
    updateStartDate: startDate || "",
    newIsCompleted: "false", 
    taskPriority: priority || "1", 
  });
  const [error, setError] = useState(""); 

  function onChangeHandler(e) {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  }

  const inputData = async (taskid) => {
    // Validate task name
    if (!data.updateTaskName.trim()) {
      setError("Please fill the task name");
      return; 
    }

    // Validate deadline
    if (!data.taskDeadLine) {
      setError("Please select a deadline");
      return; 
    }
    if (!data.updateStartDate) {
        setError("Please select a start date");
        return; 
      }

    try {
      const token = JSON.parse(localStorage.getItem('token')).token;
      let res = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/task/${taskid}`, data, {
        headers: {
          authorization: token,
        },
      });

      handleUpdateModalClose();

      setTasks((prevTasks) => {
        let pTask = [...prevTasks];
        let taskIndex = pTask.findIndex((ele) => ele._id === res.data.task._id);
        pTask[taskIndex] = res.data.task;
        return pTask;
      });

      toast.success(res.data.msg);
    } catch (error) {
      console.log(error);
      let errorString = "";
      // handling express validator errors
      if (error.response.data.errors) {
        error.response.data.errors.forEach((ele) => {
          errorString += `${ele.msg} `;
        });
        toast.error(errorString);
      } else {
        // Custom errors
        errorString = error.response.data.error;
        toast.error(errorString);
      }
    }
  };

  return (
    <>
      <Modal show={showUpdateModal} onHide={handleUpdateModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={2}>
            <label>Task Name</label>
            <input
              type="text"
              name="updateTaskName"
              value={data.updateTaskName}
              onChange={onChangeHandler}
            />
            {error && error.includes("task name") && <p style={{ color: "red" }}>{error}</p>}
          </Stack>
          <br />
          <Stack gap={2}>
            <label>Start Date</label>
            <input
              type="datetime-local"
              placeholder="Enter Start Date"
              name="updateStartDate"
              value={data.updateStartDate}
              onChange={onChangeHandler}
            />
            {error && error.includes("start date") && <p style={{ color: "red" }}>{error}</p>}
          </Stack>
          <br />
          <Stack gap={2}>
            <label>Deadline</label>
            <input
              type="datetime-local"
              placeholder="Enter Deadline"
              name="taskDeadLine"
              value={data.taskDeadLine}
              onChange={onChangeHandler}
            />
            {error && error.includes("deadline") && <p style={{ color: "red" }}>{error}</p>}
          </Stack>
          <br />
          <Stack gap={2}>
            <label>Status</label>
            <select value={data.newIsCompleted} name="newIsCompleted" onChange={onChangeHandler}>
              <option value="true">COMPLETED</option>
              <option value="false">INCOMPLETE</option>
            </select>
          </Stack>
          <br />
          <Stack gap={2}>
            <label>Priority</label>
            <select value={data.taskPriority} name="taskPriority" onChange={onChangeHandler}>
              <option value="1">1 - Low</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5 - High</option>
            </select>
          </Stack>
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleUpdateModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => inputData(id)}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateTask;
