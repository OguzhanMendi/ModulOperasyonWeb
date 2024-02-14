const initialState = {
  renew: false,
};

const contentPingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "REFETCH_CONTENT":
      return {
        ...state,
        renew: action.payload,
      };
    default:
      return state;
  }
};

export default contentPingReducer;
