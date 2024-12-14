import axios from "axios";
import React, { useState } from "react";
import { Button, Modal, Stack } from "react-bootstrap";
import toast from "react-hot-toast";

function CreateTask({ showCreateModal, handleCreateModalClose, setTasks }) {
    let [formData, setFormData] = useState({
        taskName: "",
        taskDeadLine: "",
        taskStartDate: "", 
        priority: "1", 
    });

    const { taskName, taskDeadLine, startDate, priority } = formData;

    function onChangeHandler(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function onSubmit(e) {
        try {
            e.preventDefault();
            const token = JSON.parse(localStorage.getItem('token')).token;
            let res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/task`, formData, {
                headers: {
                    Authorization: token,
                },
            });

          
            setTasks((prevTasks) => [...prevTasks, res.data.task]);
            toast.success(res.data.msg); 
            handleCreateModalClose(); 
        } catch (error) {
            let errorString = "";
            if (error.response.data.errors) {
             
                error.response.data.errors.forEach((ele) => {
                    errorString += `${ele.msg} `;
                });
                toast.error(errorString); 
            } else {
                errorString = error.response.data.error;
                toast.error(errorString); 
            }
        }
    }

    return (
        <Modal show={showCreateModal} onHide={handleCreateModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Stack gap={3}>
                    <label>Task Name</label>
                    <input
                        type="text"
                        placeholder="Task Title"
                        value={taskName}
                        name="taskName"
                        onChange={onChangeHandler}
                    />
                </Stack>
                <br />
                <Stack gap={3}>
                    <label>Start Date</label>
                    <input
                        type="datetime-local"
                        placeholder="Start Date and Time"
                        value={startDate}
                        name="startDate"
                        onChange={onChangeHandler}
                    />
                </Stack>
                <br />
                <Stack gap={3}>
                    <label>Deadline</label>
                    <input
                        type="datetime-local"
                        placeholder="Deadline"
                        value={taskDeadLine}
                        name="taskDeadLine"
                        onChange={onChangeHandler}
                    />
                </Stack>
                <br />
                <Stack gap={3}>
                    <label>Priority</label>
                    <select
                        name="priority"
                        value={priority}
                        onChange={onChangeHandler}
                    >
                        <option value="1">1 - High</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5 - Low</option>
                    </select>
                </Stack>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCreateModalClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={onSubmit}>
                    Create
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateTask;
