import React from 'react'
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import toast from "react-hot-toast";
import axios from "axios";
import { useContext, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext'

function Login() {
  let navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  console.log(process.env.REACT_APP_BASE_URL);
  
  let [userData, setUserData] = useState({
    email: undefined,
    password: undefined
  });

  const { email, password } = userData;

  function onChangeHandler(e) {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  }

  async function onClick(e) {
    try {
      e.preventDefault();

      let res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/user/login`, userData);
      console.log(res.data);
      const { token, details } = res.data;

      localStorage.setItem('token', JSON.stringify({ token, details }));
      dispatch({ type: "LOGIN_SUCCESS", payload: details });
      toast.success("You are logged in!");
      navigate('/dashboard');
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: error.response.data });
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
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "800px" }}>
      <Form className="w-100" onSubmit={onClick}>
        <h3 className="text-center mb-4">LOGIN</h3>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            name="email"
            onChange={onChangeHandler}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            name="password"
            onChange={onChangeHandler}
          />
        </Form.Group>

        <Form.Group className="text-center mb-3">
          <Form.Label>
            Not Registered?{" "}
            <Link to={"/signup"} className="text-decoration-none">
              REGISTER NOW
            </Link>
          </Form.Label>
        </Form.Group>

        <Button
          variant="warning"
          type="submit"
          className="w-100 text-light fw-bold fs-5"
        >
          Submit
        </Button>
      </Form>
    </Container>
  );
}

export default Login;