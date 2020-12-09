import { all, fork } from "redux-saga/effects";
import axios from "axios";

import authSaga from "./authSaga";
import postSaga from "./postSaga";

import dotenv from "dotenv";
dotenv.config();

axios.defaults.baseURL = process.env.REACT_APP_BASIC_SERVER_URL;

// this called generator function.
// this function makes it return multiple values.
export default function* rootSaga() {
  yield all([fork(authSaga), fork(postSaga)]);
}
