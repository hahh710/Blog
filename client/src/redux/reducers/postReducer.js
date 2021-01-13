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
  POST_DELETE_REQUEST,
  POST_DELETE_SUCCESS,
  POST_DELETE_FAILURE,
  POST_EDIT_LOADING_REQUEST,
  POST_EDIT_LOADING_SUCCESS,
  POST_EDIT_LOADING_FAILURE,
  POST_EDIT_UPLOADING_REQUEST,
  POST_EDIT_UPLOADING_SUCCESS,
  POST_EDIT_UPLOADING_FAILURE,
  CATEGORY_FIND_REQUEST,
  CATEGORY_FIND_SUCCESS,
  CATEGORY_FIND_FAILURE,
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
        posts: [...state.posts, ...action.payload.postFindResult],
        categoryFindResult: [...action.payload.categoryFindResult],
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
        creatorId: action.payload.creator._id,
        title: action.payload.title,
      };
    case POST_DETAIL_LOADING_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case POST_DELETE_REQUEST:
      return {
        ...state,
        posts: [],
        isLoading: true,
      };
    case POST_DELETE_SUCCESS:
      return {
        ...state,
        posts: [],
        isLoading: false,
      };
    case POST_DELETE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case POST_EDIT_LOADING_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case POST_EDIT_LOADING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        postDetail: action.payload,
        title: action.payload.title,
        creatorId: action.payload.creator._id,
      };
    case POST_EDIT_LOADING_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case POST_EDIT_UPLOADING_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case POST_EDIT_UPLOADING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        posts: action.payload,
        isAuthenticated: true,
      };
    case POST_EDIT_UPLOADING_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case CATEGORY_FIND_REQUEST:
      return {
        ...state,
        posts: [],
        isLoading: true,
      };
    case CATEGORY_FIND_SUCCESS:
      return {
        ...state,
        categoryFindResult: action.payload,
        isLoading: false,
      };
    case CATEGORY_FIND_FAILURE:
      return {
        ...state,
        categoryFindResult: action.payload,
        error: action.payload,
        isLoading: false,
      };

    default:
      return state;
  }
};
export default postReducer;
