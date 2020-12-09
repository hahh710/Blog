import axios from "axios";
import { all, call, put, takeEvery, fork } from "redux-saga/effects";
import {
  CLEAR_ERROR_FAILURE,
  CLEAR_ERROR_REQUEST,
  CLEAR_ERROR_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  USER_LOADING_FAILURE,
  USER_LOADING_REQUEST,
  USER_LOADING_SUCCESS,
} from "../types";

// Login
const loginUserAPI = (loginData) => {
  console.log(loginData, "loginData");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post("api/auth", loginData, config);
};

function* loginUser(action) {
  try {
    const result = yield call(loginUserAPI, action.payload);
    console.log(result);
    yield put({
      type: LOGIN_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: LOGIN_FAILURE,
      payload: e.response,
    });
  }
}

function* watchLoginUser() {
  //Keep watching if there is LOGIN_REQUEST
  //If there is, Then do loginUser.
  yield takeEvery(LOGIN_REQUEST, loginUser);
}

//LOGOUT
function* logout(action) {
  try {
    yield put({
      type: LOGOUT_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: LOGOUT_FAILURE,
    });
    console.log(e);
  }
}

function* watchLogout() {
  //Keep watching if there is LOGIN_REQUEST
  //If there is, Then do loginUser.
  yield takeEvery(LOGOUT_REQUEST, logout);
}

//User Loading
const userLoadingAPI = (token) => {
  console.log(token);
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return axios.get("api/auth/user", config);
};

function* userLoading(action) {
  try {
    console.log(action, "userloading");
    const result = yield call(userLoadingAPI, action.payload);
    console.log(result, "Result User loading");
    yield put({
      type: USER_LOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: USER_LOADING_FAILURE,
      payload: e.response,
    });
  }
}

function* watchUserLoading() {
  //Keep watching if there is LOGIN_REQUEST
  //If there is, Then do loginUser.
  yield takeEvery(USER_LOADING_REQUEST, userLoading);
}

// Registration
const registerUserAPI = (userData) => {
  console.log(userData, "Registration Info");
  // Registration doesn't need token
  return axios.post("api/user", userData);
};

function* registerUser(action) {
  try {
    const result = yield call(registerUserAPI, action.payload);
    console.log(result, "Registration Data");
    yield put({
      type: REGISTER_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: REGISTER_FAILURE,
      payload: e.response,
    });
  }
}

function* watchRegisterUser() {
  yield takeEvery(REGISTER_REQUEST, registerUser);
}

// Clear Error
// Clearing Error doesn't require API
function* clearError() {
  try {
    yield put({
      type: CLEAR_ERROR_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: CLEAR_ERROR_FAILURE,
    });
  }
}

function* watchClearError() {
  yield takeEvery(CLEAR_ERROR_REQUEST, clearError);
}

export default function* authSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchLogout),
    fork(watchUserLoading),
    fork(watchRegisterUser),
    fork(watchClearError),
  ]);
}
