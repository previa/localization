import { connect } from 'react-redux'
import LoginPage from '../components/LoginPage.jsx';
import { login } from '../actions/LoginActions.jsx'
import { push } from 'react-router-redux'

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginClick: (username, password) => {
      if (username === 'admin' && password === 'admin') {
        dispatch(login());
        dispatch(push('/home'));
      } else {
        alert('Wrong username or password');
      }
    }
  }
}

const LoginPageContainer = connect(
  null, //no state mapped to props
  mapDispatchToProps
)(LoginPage)

export default LoginPageContainer
