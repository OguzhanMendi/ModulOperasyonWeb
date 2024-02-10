const initialState = {
  user: {
    ad: "",
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
          ad: "",
        },
      };

    default:
      return state;
  }
};

export default userReducer;
