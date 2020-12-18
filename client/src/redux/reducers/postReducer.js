import {
  POST_LOADING_FAILURE,
  POST_LOADING_REQUEST,
  POST_LOADING_SUCCESS,
  POST_WRITE_REQUEST,
  POST_WRITE_SUCCESS,
  POST_WRITE_FAILURE,
  POST_DETAIL_LOADING_SUCCESS,
  POST_DETAIL_LOADING_REQUEST,
  POST_DETAIL_LOADING_FAILURE,
} from "../types";

const initialState = {
  isAuthenticated: null,
  posts: [],
  postDetail: "",
  //count is for infinity scroll
  postCount: "",
  isLoading: false,
  error: "",
  creatorId: "",
  categoryFindResult: "",
  title: "",
  searchBy: "",
  searchResult: "",
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_WRITE_REQUEST:
      return {
        ...state,
        posts: [],
        isLoading: true,
      };
    case POST_WRITE_SUCCESS:
      return {
        ...state,
        posts: [],
        isLoading: false,
      };
    case POST_WRITE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case POST_LOADING_REQUEST:
      return {
        ...state,
        posts: [],
        isLoading: true,
      };
    case POST_LOADING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        posts: [...state.posts, ...action.payload],
      };
    case POST_LOADING_FAILURE:
      return {
        ...state,
        isLoading: false,
      };

    case POST_DETAIL_LOADING_REQUEST:
      return {
        ...state,
        posts: [],
        isLoading: true,
      };
    case POST_DETAIL_LOADING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        postDetail: action.payload,
        creatorId: action.payload._id,
        title: action.payload.title,
      };
    case POST_DETAIL_LOADING_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    default:
      return state;
  }
};
export default postReducer;
