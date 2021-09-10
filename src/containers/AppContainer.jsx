import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import App from '../components/App.jsx';
import { logout } from '../actions/LoginActions.jsx'
import Anchor from '../models/Anchor'

const mapStateToProps = (state, ownProps) => {
  return {
    loggedIn: state.login.loggedIn
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    redirectToLogin: () => {
      dispatch(push('/login'));
    },
    logout: () => {
      dispatch(logout());
      dispatch(push('/login'));
    }
  }
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

export default AppContainer
