import React, {Component} from 'react';
import BigButton from '../components/BigButton.jsx'
import { Link } from 'react-router'

class HomePage extends Component {
    render() {
        return (
            <div className="center-elem">
                <h3>Welcome to Pozyx!</h3>
                <p>It's time to configure your setup.<br/>Watch our Getting Started video, or hit Start to get configuring.</p>
                <br/>
                  <iframe className="youtubeVideo" width="560" height="315" src="https://www.youtube.com/embed/UsN5NSzHFl0" frameBorder="0" allowFullScreen></iframe>
                <br/>
                <Link to="/map"><BigButton>Start configuring my setup  &#10143;</BigButton></Link>
            </div>);
    }
}

export default HomePage;
