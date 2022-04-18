import actionTypes from "../actions/actionTypes";

const initialState = {
  users: [],
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_USER_SUCCESS:
      return {
        ...state,
      };

    case actionTypes.CREATE_USER_FAILED:
      return {
        ...state,
      };

    case actionTypes.FETCH_ALLUSER_SUCCESS:
      state.users = action.users;
      return {
        ...state,
      };

    case actionTypes.FETCH_ALLUSER_FAILED:
      state.users = [];
      return {
        ...state,
      };
    case actionTypes.DELETE_USER_SUCCESS:
      return {
        ...state,
      };

    case actionTypes.DELETE_USER_FAILED:
      return {
        ...state,
      };

    case actionTypes.EDIT_USER_SUCCESS:
      return {
        ...state,
      };

    case actionTypes.EDIT_USER_FAILED:
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default appReducer;
