import React, {Component} from 'react';
import { Link } from 'react-router'

class Header extends Component {
    render() {
        return (
            <header>
              <Link id="home-logo" to="/home"><img src="/public/img/logo.png" alt="pozyx logo" height="46px"/></Link>
              <ul>
                  <li><Link to="/map" className={this.getTabCssClass('/map')}>Visualisation &amp; Search</Link></li>
                  <li><Link to="/monitor" className={this.getTabCssClass('/monitor')}>Monitor view</Link></li>
              </ul>
              <div className="header-user-controls">
                <div onClick={() => { this.props.logout(); }}>Sign out</div>
              </div>
            </header>);
    }

    getTabCssClass(route) {
      return (this.props.active === route) ? 'active-tab' : 'unactive-tab';
    }
}

export default Header;
