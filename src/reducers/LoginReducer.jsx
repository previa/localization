const initialState = {
  loggedIn: false
}

/*
* The login reducer will change the state it gets according to the dispatched action.
*/

function login(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN':
      return Object.assign({}, state, {
        loggedIn: true
      })
    case 'LOGOUT':
      return Object.assign({}, state, {
        loggedIn: false
      })
    default:
      return state
  }
}

export default login
