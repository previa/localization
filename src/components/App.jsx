import React, { Component } from 'react';
import Header from '../components/Header.jsx';
import PropTypes from 'prop-types';

class App extends Component {
    render() {
        return (
            <div>
                <Header active={this.props.location.pathname} logout={this.props.logout}/>
                {this.props.children}
            </div>
        );
    }



    componentWillMount() {
      //redirect if not logged in
      if (!this.props.loggedIn) {
        this.props.redirectToLogin();
      }
    }
}

App.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  redirectToLogin: PropTypes.func.isRequired
}

export default App;
