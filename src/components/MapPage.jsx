import React, { Component } from 'react';
import MapContainer from '../containers/MapContainer.jsx';
import LeftSideBarContainer from '../containers/LeftSideBarContainer.jsx';
import RightSideBarContainer from '../containers/RightSideBarContainer.jsx';

class MapPage extends Component {
    render() {
        return (
            <div id="page_container">
                <LeftSideBarContainer />
                <MapContainer />
                <RightSideBarContainer />
            </div>
        );
    }
}

export default MapPage;
