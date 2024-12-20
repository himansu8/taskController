import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Modal, Stack } from "react-bootstrap";

function ViewTask({ showViewModal, handleViewModalClose, id }) {
    const [task, setTask] = useState([]);

    const fetchTask = async (id) => {

        try {

            const token = JSON.parse(localStorage.getItem('token')).token;
            let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/task/${id}`, {
                headers: {
                    authorization:token
                }
            });
            setTask(res.data);
            console.log(res.data)
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchTask(id);
    }, [id]);
    return (
        <>
            <Modal show={showViewModal} onHide={handleViewModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>View Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Stack>
                        <p className="fw-bold mb-0">Id</p>
                        <p>{task._id}</p>
                    </Stack>
                    <Stack>
                        <p className="fw-bold mb-0">Title</p>
                        <p>{task.taskName}</p>
                    </Stack>
                    <Stack>
                        <p className="fw-bold mb-0">Created At</p>
                        <p>{new Date(task?.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}</p>
                    </Stack>
                    <Stack>
                        <p className="fw-bold mb-0">Task Deadline</p>
                        <p>{new Date(task?.deadline).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}</p>
                    </Stack>
                    <Stack>
                        <p className="fw-bold mb-0">Task Deadline</p>
                        <p>{task.isCompleted ? "completed" : "Pending"}</p>
                    </Stack>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleViewModalClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ViewTask