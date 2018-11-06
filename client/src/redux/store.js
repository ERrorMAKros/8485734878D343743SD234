import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import Reducers from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose ;
const middleware = applyMiddleware( thunk ) ;
const composer = composeEnhancers( middleware ) ;
const store = createStore( Reducers, composer ) ;

export default store ;