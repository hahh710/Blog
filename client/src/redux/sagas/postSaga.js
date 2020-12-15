import axios from "axios";
import { all, call, put, takeEvery, fork } from "redux-saga/effects";
import { push } from "connected-react-router";
import {
  POST_LOADING_FAILURE,
  POST_LOADING_REQUEST,
  POST_LOADING_SUCCESS,
  POST_UPLOAD_REQUEST,
  POST_UPLOAD_SUCCESS,
  POST_UPLOAD_FAILURE,
} from "../types";

//All Post Load

const loadPostAPI = () => {
  return axios.get("/api/post");
};

function* loadPosts() {
  try {
    const result = yield call(loadPostAPI);
    console.log(result, "LoadPosts");
    yield put({
      type: POST_LOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: POST_LOADING_FAILURE,
      payload: e,
    });
    yield push("/");
  }
}

function* watchLoadPosts() {
  yield takeEvery(POST_LOADING_REQUEST, loadPosts);
}

//Post Upload
const uploadPostAPI = (payload) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const token = payload.token;
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return axios.post("api/post/", payload, config);
};

function* uploadPost(action) {
  try {
    const result = yield call(uploadPostAPI, action.payload);
    console.log(result, "upLoadPost");
    yield put({
      type: POST_UPLOAD_SUCCESS,
      payload: result.data,
    });
    yield put(push(`/post/${result.data._id}`));
  } catch (e) {
    yield put({
      type: POST_UPLOAD_FAILURE,
      payload: e,
    });
    yield push("/");
  }
}

function* watchuploadPost() {
  yield takeEvery(POST_UPLOAD_REQUEST, uploadPost);
}

export default function* postSaga() {
  yield all([fork(watchLoadPosts), fork(watchuploadPost)]);
}
