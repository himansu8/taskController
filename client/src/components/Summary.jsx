import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function SummaryPage() {
    const [tasksSummary, setTasksSummary] = useState({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
    });
    const [averageTime, setAverageTime] = useState(null);
    const navigate = useNavigate();

    // Fetch summary data and all tasks from the server
    useEffect(() => {
        async function fetchSummaryData() {
            try {
                const token = JSON.parse(localStorage.getItem('token')).token;
                const summaryRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/task/data/summary`, {
                    headers: {
                        Authorization: token,
                    },
                });

                setTasksSummary(summaryRes.data);

                // Fetch all tasks to calculate the average time for completed tasks
                const tasksRes = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/task`, {
                    headers: {
                        Authorization: token,
                    },
                });

                calculateAverageTime(tasksRes.data);
            } catch (error) {
                console.log(error);
            }
        }

        fetchSummaryData();
    }, []);

    // Function to calculate the average time for completed tasks
    const calculateAverageTime = (tasks) => {
        const completedTasks = tasks.filter(task => task.isCompleted);

        if (completedTasks.length > 0) {
            const totalTime = completedTasks.reduce((acc, task) => {
                const createdAt = new Date(task.createdAt);
                let completedAt = new Date(task.completedAt);

                if (isNaN(completedAt.getTime())) {
                    completedAt = new Date();
                }

                const timeDifference = completedAt - createdAt;
                return acc + timeDifference;
            }, 0);

            const averageTime = totalTime / completedTasks.length;
            setAverageTime(averageTime > 0 ? averageTime : 0);
        } else {
            setAverageTime(0);
        }
    };

    // Calculate percentage of completed tasks
    const calculateCompletedPercentage = () => {
        const { totalTasks, completedTasks } = tasksSummary;
        return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    };

    // Format time (milliseconds) into a readable format
    const formatTime = (timeInMs) => {
        if (timeInMs === null || timeInMs === 0) return "N/A";

        const hours = Math.floor(timeInMs / (1000 * 60 * 60));
        const minutes = Math.floor((timeInMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeInMs % (1000 * 60)) / 1000);

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <Container className="mt-5">
            <Row className="text-center mb-4">
                <h2 className="text-3xl font-bold text-gray-800">Task Summary</h2>
                <p className="text-gray-600">An overview of the tasks you have in the system.</p>
            </Row>

            {/* Task Completion and Average Time */}
            <Row className="justify-content-center mb-4">
                <Col sm={12} md={6} lg={4} className="mb-4">
                    <Card className="shadow-xl p-4">
                        <Card.Body>
                            <h5 className="text-xl font-semibold text-center text-gray-800">Task Completion Progress</h5>
                            <p className="text-center text-gray-600 mb-3">{calculateCompletedPercentage()}% of your tasks are completed</p>
                            <ProgressBar
                                now={calculateCompletedPercentage()}
                                label={`${calculateCompletedPercentage()}%`}
                                animated
                                variant="success"
                            />
                        </Card.Body>
                    </Card>
                </Col>

                <Col sm={12} md={6} lg={4} className="mb-4">
                    <Card className="shadow-xl p-4">
                        <Card.Body>
                            <h5 className="text-xl font-semibold text-center text-gray-800">Average Time to Complete One Task</h5>
                            <p className="text-center text-gray-600 mb-3">{formatTime(averageTime)}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
<Row>
    
</Row>
            {/* Total, Completed and Pending Tasks */}
            <Row className="justify-content-center">
                <Col sm={12} md={6} lg={3} className="mb-4">
                    <Card className="shadow-xl p-4">
                        <Card.Body>
                            <h5 className="text-xl font-semibold text-center text-gray-800">Total Tasks</h5>
                            <p className="text-center text-gray-600 text-2xl">{tasksSummary.totalTasks}</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col sm={12} md={6} lg={3} className="mb-4">
                    <Card className="shadow-xl p-4">
                        <Card.Body>
                            <h5 className="text-xl font-semibold text-center text-gray-800">Completed Tasks</h5>
                            <p className="text-center text-gray-600 text-2xl">{tasksSummary.completedTasks}</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col sm={12} md={6} lg={3} className="mb-4">
                    <Card className="shadow-xl p-4">
                        <Card.Body>
                            <h5 className="text-xl font-semibold text-center text-gray-800">Pending Tasks</h5>
                            <p className="text-center text-gray-600 text-2xl">{tasksSummary.pendingTasks}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* View All Tasks Button */}
            <Row className="justify-content-center">
                <Col sm={12} className="text-center">
                    <Button variant="primary" onClick={() => navigate('/')} className="w-48">View All Tasks</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default SummaryPage;
