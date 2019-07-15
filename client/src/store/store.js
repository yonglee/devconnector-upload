import { createStore, applyMiddleware, compose } from 'redux';
// import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middleware = [thunk];

// const enhancers =
//   typeof window !== undefined && process.env.NODE_ENV !== 'production'
//     ? composeWithDevTools(applyMiddleware(...middleware))
//     : compose(applyMiddleware(...middleware));

const enhancers =
  typeof window !== 'undefined' && process.env.NODE_ENV !== 'production'
    ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
    : f => f;

const store = createStore(
  rootReducer,
  initialState,
  // composeWithDevTools(applyMiddleware(...middleware))
  compose(
    applyMiddleware(...middleware),
    enhancers
  )
);

export default store;
