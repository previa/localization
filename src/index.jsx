// Application entrypoint.
// Load up the application styles
require("./styles/normalize.scss");
require("./styles/application.scss");

// Render the top-level React component
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';
import AppContainer from './containers/AppContainer.jsx';
import MapPage from './components/MapPage.jsx';
import LoginPageContainer from './containers/LoginPageContainer.jsx';
import HomePage from './components/HomePage.jsx';
import MonitorPage from './components/MonitorPage.jsx'
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware  } from 'redux'
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'
import login from './reducers/LoginReducer.jsx'
import map from './reducers/MapReducer.jsx'
import monitor from './reducers/MonitorReducer.jsx'
import { loadState, saveState } from './localStorage.jsx'
import vex from 'vex-js';
import vexdialog from 'vex-dialog';

// Allows route navigation via Redux
const middleware = routerMiddleware(browserHistory)

// Initialize Vex
vex.registerPlugin(vexdialog);
vex.defaultOptions.className = 'vex-theme-default';

// Load older state
const persistedState = loadState();

// Add the reducer to the store on the `routing` key
const store = createStore(
  combineReducers({
    login,
    map,
    monitor,
    routing: routerReducer
  }),
  persistedState,
  applyMiddleware(middleware)
)

// Save state change on refresh
store.subscribe(() => {
  saveState({
    login: store.getState().login
  });
})

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
          <Route path="/" component={AppContainer}>
              <IndexRoute component={MapPage} />
              <Route path = "/map" component = {MapPage}/>
              <Route path = "/home" component = {HomePage}/>
              <Route path = "/monitor" component = {MonitorPage}/>
          </Route>
          <Route path="/login" component={LoginPageContainer}>
              <IndexRoute component={LoginPageContainer} />
          </Route>
      </Router>
    </Provider>
), document.getElementById('react-root'));
