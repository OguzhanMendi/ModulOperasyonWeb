import { combineReducers } from "redux";
import userReducer from "./userReducer";
import uzakListReducer from "./uzakListReducer";

const rootReducer = combineReducers({
  user: userReducer,
  contentPing: uzakListReducer,
});

export default rootReducer;
