import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  NavLink,
  Modal,
  FormGroup,
  Label,
  Input,
  Form,
  ModalHeader,
  Alert,
  ModalBody,
  Button,
} from "reactstrap";
import { CLEAR_ERROR_REQUEST, REGISTER_REQUEST } from "../../redux/types";

const RegisterModal = () => {
  const [modal, setModal] = useState(false);
  const [form, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [localMsg, setLocalMsg] = useState("");
  const { errorMsg } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch({
      type: CLEAR_ERROR_REQUEST,
    });
    setModal(!modal);
  };

  // When There is a change in [errorMsg], then do try{}
  useEffect(() => {
    try {
      setLocalMsg(errorMsg);
    } catch (e) {
      //in the console, console.log throws just message, but conosole.error(e) throws error message
      console.error(e);
    }
  }, [errorMsg]);

  const onChange = (e) => {
    setValues({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password } = form;
    const newUser = { name, email, password };
    console.log(newUser, "newUser");
    dispatch({
      type: REGISTER_REQUEST,
      payload: newUser,
    });
  };

  return (
    <div>
      <NavLink onClick={handleToggle} href="#">
        Register
      </NavLink>
      <Modal isOpen={modal} toggle={handleToggle}>
        <ModalHeader toggle={handleToggle}>Register</ModalHeader>
        <ModalBody>
          {localMsg ? <Alert color="danger">{localMsg}</Alert> : null}
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <Label for="name"> Name </Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Name"
                onChange={onChange}
              ></Input>

              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                onChange={onChange}
              ></Input>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                onChange={onChange}
              ></Input>
              <Button color="dark" className="mt-2" block>
                Submit
              </Button>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal> 
    </div>
  );
};

export default RegisterModal;
