import { combineReducers } from "redux"
import RemoteEvents from "./RemoteEventsReducer"
import SignIn from "./SignInReducer"
import Search from "./SearchReducer"
import Layout from "./LayoutReducer"
import Catalogue from "./CatalogueReducer"

const rootReducer = combineReducers({
  RemoteEvents,
  SignIn,
  Search,
  Layout,
  Catalogue
});

export default rootReducer;
