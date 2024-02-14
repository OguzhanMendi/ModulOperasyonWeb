const initialState = {
  user: {
    username: "",
    fullname: "",
  },
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };

    case "LOGOUT":
      return {
        ...state,
        user: {
          username: "",
          fullname: "",
        },
      };

    default:
      return state;
  }
};

export default userReducer;
