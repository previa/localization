import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BigButton from '../components/BigButton.jsx'

class LoginPage extends Component {
    constructor(props) {
      super(props);
      this.state = {
       username: '',
       password: ''
      };

      this.onUpdateUsername = this.onUpdateUsername.bind(this);
      this.onUpdatePassword = this.onUpdatePassword.bind(this);
     }

    onUpdateUsername(e) {
      this.setState({ username: e.target.value });
    }

    onUpdatePassword(e) {
      this.setState({ password: e.target.value });
    }

    render() {
        return (
            <section id="login-parent">
                <form id="loginform" onSubmit={() => {this.props.onLoginClick(this.state.username, this.state.password)}}>
                  <img src="/public/img/logo.png" alt="pozyx logo" height="32px" className="login-center"/>
                  <p id="login-tagline">Sign into your Pozyx account.</p>

                  <input type="text" placeholder="Email address" onChange={this.onUpdateUsername} />
                  <input type="password" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" onChange={this.onUpdatePassword} />
                  <input  className="big-button" type="submit" value="Sign in"/>

                  <div id="link-container">
                    <a href="#">Help</a>
                    <a href="#">Forgot your password?</a>
                  </div>
                </form>
            </section>
        );
    }
}

LoginPage.propTypes = {
  onLoginClick: PropTypes.func.isRequired
}

export default LoginPage;
