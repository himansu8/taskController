import axios from "axios";
import Table from 'react-bootstrap/Table';
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEye } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Button, Dropdown } from "react-bootstrap";
import UpdateTask from "./UpdateTask";
import ViewTask from "./ViewTask";
import CreateTask from "./CreateTask";

function Home() {
    const [tasks, setTasks] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]); // To track selected tasks
    const [taskTitle, setTaskTitle] = useState("");
    const [sortCriteria, setSortCriteria] = useState(""); // For storing the selected sort option

    async function fetchTasks() {
        try {
            const token = JSON.parse(localStorage.getItem('token')).token;
            let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/task`, {
                headers: {
                    Authorization: token
                }
            });
            setTasks(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    const [showViewModal, setShowViewModal] = useState(false);
    const [viewTaskId, setViewTaskId] = useState(null);

    const handleViewModalClose = () => setShowViewModal(false);
    const handleViewModalShow = (id) => {
        setViewTaskId(id);
        setShowViewModal(true);
    };

    const [showCreateModal, setShowCreateModal] = useState(false);
    const handleCreateModalClose = () => setShowCreateModal(false);
    const handleCreateModalShow = () => setShowCreateModal(true);

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updatedTaskId, setUpdateTaskId] = useState(null);
    const [updatedTaskName, setUpdatedTaskName] = useState(null);
    const [updatedDeadline, setUpdatedDeadline] = useState(null);
    const [updatedStartDate, setUpdatedStartDate] = useState(null);


    const handleUpdateModalClose = () => setShowUpdateModal(false);

    const handleUpdateModalShow = (id, taskName, deadline, startDate) => {
        setUpdateTaskId(id);
        setUpdatedTaskName(taskName);
        setUpdatedDeadline(deadline);
        setUpdatedStartDate(startDate)
        setShowUpdateModal(true);
    };

    async function deleteTask(taskId) {
        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        if (!confirmDelete) return;
        try {
            const token = JSON.parse(localStorage.getItem('token')).token;
            const res = await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/task/${taskId}`, {
                headers: {
                    authorization: token
                }
            });

            let updatedTasks = tasks.filter((ele) => ele._id !== taskId);
            setTasks(updatedTasks);
            toast.success(res.data.msg);
        } catch (error) {
            console.log(error);
        }
    }

    // Delete multiple tasks
    async function deleteSelectedTasks() {
        const confirmDelete = window.confirm("Are you sure you want to delete selected tasks?");
        if (!confirmDelete) return;

        try {

            const token = JSON.parse(localStorage.getItem('token')).token;
            for (let taskId of selectedTasks) {
                await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/task/${taskId}`, {
                    headers: {
                        authorization: token
                    }
                });
            }
            setTasks(tasks.filter(task => !selectedTasks.includes(task._id)));
            setSelectedTasks([]); // Clear selected tasks after deletion
            toast.success("Selected tasks deleted successfully.");
        } catch (error) {
            console.log(error);
        }
    }

    const handleSelectTask = (taskId) => {
        setSelectedTasks(prevState =>
            prevState.includes(taskId)
                ? prevState.filter(id => id !== taskId)
                : [...prevState, taskId]
        );
    };

    const filterTasks = async (filterType, priority) => {
        const token = JSON.parse(localStorage.getItem('token')).token;
        let res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/task`, {
            headers: {
                authorization: token
            }
        });
        let tasksData = res.data;
        let filteredTasks = [];

        switch (filterType) {
            case "completed":
                filteredTasks = tasksData.filter((task) => task.isCompleted);
                setTaskTitle("Completed Tasks");
                break;
            case "incomplete":
                filteredTasks = tasksData.filter((task) => !task.isCompleted);
                setTaskTitle("Incomplete Tasks");
                break;
            case "all":
                filteredTasks = tasksData;
                setTaskTitle("Tasks");
                break;
            default:
                filteredTasks = tasksData;
        }

        // Filter by priority if specified
        if (priority) {
            filteredTasks = filteredTasks.filter((task) => task.priority === priority);
        }

        setTasks(filteredTasks);
    };


    // Sorting function
    const sortTasks = (criteria) => {
        setSortCriteria(criteria);
        let sortedTasks = [...tasks];
        switch (criteria) {
            case "start-asc":
                sortedTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case "start-desc":
                sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case "end-asc":
                sortedTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
                break;
            case "end-desc":
                sortedTasks.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
                break;
            default:
                break;
        }
        setTasks(sortedTasks);
    };

    const handleClearFilters = async () => {

        setTaskTitle("Tasks");
        setSortCriteria("");
        await fetchTasks();
        setSelectedTasks([]);
    };
    return (
        <Container fluid>
            <Container>
                <Row>
                    <div className="col-lg-12 d-flex justify-content-between align-items-center mb-3 mt-4">
                        <Button
                            variant="primary"
                            className="rounded-pill btn-sm"
                            onClick={handleCreateModalShow}>
                            Create Task
                        </Button>
                        <div className="d-flex gap-2">
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="primary"
                                    id="filter-dropdown"
                                    className="rounded-pill btn-sm">
                                    Filter
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => filterTasks("all")}>All Tasks</Dropdown.Item>
                                    <Dropdown.Item onClick={() => filterTasks("completed")}>Completed Tasks</Dropdown.Item>
                                    <Dropdown.Item onClick={() => filterTasks("incomplete")}>Incomplete Tasks</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="secondary"
                                    id="sort-dropdown"
                                    className="rounded-pill btn-sm">
                                    Sort
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => sortTasks("start-asc")}>Start Time: ASC</Dropdown.Item>
                                    <Dropdown.Item onClick={() => sortTasks("start-desc")}>Start Time: DESC</Dropdown.Item>
                                    <Dropdown.Item onClick={() => sortTasks("end-asc")}>End Time: ASC</Dropdown.Item>
                                    <Dropdown.Item onClick={() => sortTasks("end-desc")}>End Time: DESC</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="success"
                                    id="priority-dropdown"
                                    className="rounded-pill btn-sm">
                                    Priority
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => filterTasks("all", 1)}>1</Dropdown.Item>
                                    <Dropdown.Item onClick={() => filterTasks("all", 2)}>2</Dropdown.Item>
                                    <Dropdown.Item onClick={() => filterTasks("all", 3)}>3</Dropdown.Item>
                                    <Dropdown.Item onClick={() => filterTasks("all", 4)}>4</Dropdown.Item>
                                    <Dropdown.Item onClick={() => filterTasks("all", 5)}>5</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </Row>
                <Row>
                    <div className="col-lg-12 d-flex justify-content-between align-items-center mb-3 mt-4">

                    <Button
                        variant="danger"
                        className="mb-3 rounded-pill"
                        disabled={selectedTasks.length === 0}
                        onClick={deleteSelectedTasks}>
                        Delete Selected Tasks
                    </Button>
                    <Button
                        variant="danger"
                        className="rounded-pill btn-sm"
                        onClick={handleClearFilters}
                    >
                        Clear Filters
                    </Button>
                    </div>
                </Row>
                <Row>
                    <div className="col-lg-12">
                        <h1>{taskTitle}</h1>

                        <Table responsive striped bordered hover>
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedTasks(tasks.map(task => task._id));
                                                } else {
                                                    setSelectedTasks([]);
                                                }
                                            }}
                                            checked={selectedTasks.length === tasks.length}
                                        />
                                    </th>
                                    <th>Serial No</th>
                                    <th>Priority</th>
                                    <th>Task Name</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                    <th>Delete</th>
                                    <th>Edit</th>
                                    <th>View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.length > 0 ? (
                                    tasks.map((task, index) => (
                                        <tr key={task._id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTasks.includes(task._id)}
                                                    onChange={() => handleSelectTask(task._id)}
                                                />
                                            </td>

                                            <td>{1 + index}</td>
                                            <td>{task?.priority}</td>
                                            <td>{task?.taskName}</td>
                                            <td>{new Date(task?.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}</td>
                                            <td>{new Date(task?.deadline).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}</td>
                                            <td>{task?.isCompleted ? "completed" : "Pending"}</td>
                                            <td>
                                                <span className="delete-button" type="delete" style={{ cursor: "pointer" }} onClick={() => deleteTask(task._id)}><MdDelete className="fs-3" /></span>
                                            </td>
                                            <td>
                                                <span className="edit-button" type="edit" style={{ cursor: "pointer" }} onClick={() => handleUpdateModalShow(task._id, task.taskName, task.deadline, task.createdAt)}><MdEdit className="fs-3" /></span>
                                            </td>
                                            <td>
                                                <span className="edit-button" type="edit" style={{ cursor: "pointer" }} onClick={() => handleViewModalShow(task._id)}><FaEye className="fs-3" /></span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center">No tasks found .</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Row>
            </Container>
            <CreateTask
                handleCreateModalClose={handleCreateModalClose}
                showCreateModal={showCreateModal}
                setTasks={setTasks}
            />
            <UpdateTask
                handleUpdateModalClose={handleUpdateModalClose}
                showUpdateModal={showUpdateModal}
                id={updatedTaskId}
                taskName={updatedTaskName}
                deadline={updatedDeadline}
                startDate={updatedStartDate}
                setTasks={setTasks}
                fetchTasks={fetchTasks}
            />
            <ViewTask
                handleViewModalClose={handleViewModalClose}
                showViewModal={showViewModal}
                id={viewTaskId}
            />
        </Container>
    )
}

export default Home;
