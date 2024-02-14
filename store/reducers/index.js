import { combineReducers } from "redux";
import userReducer from "./userReducer";
import contentPingReducer from "./contentPingReducer";

const rootReducer = combineReducers({
  user: userReducer,
  contentPing: contentPingReducer,
});

export default rootReducer;
