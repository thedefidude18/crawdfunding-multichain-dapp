import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { createWrapper } from "next-redux-wrapper";
import reducers from "./reducers";

const initialState = {};

const middleware = [thunk];

export const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(
    applyMiddleware(...middleware)
  )
);

const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
