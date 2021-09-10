import React, { Component } from 'react';
import ZoneOverviewSideBar from '../components/ZoneOverviewSideBar.jsx';
import VisibilityOverviewSideBarContainer from '../containers/VisibilityOverviewSideBarContainer.jsx';


class RightSideBar extends Component {
    render() {
        return (
            <aside className="sidebar">
              <VisibilityOverviewSideBarContainer />
              <ZoneOverviewSideBar zones={this.props.zones} toggleAction={this.props.toggleSingleZoneVisibility} editAction={this.props.removeZone} toggleZoneCreation={this.props.toggleZoneCreation} />
            </aside>
        );
    }
}

export default RightSideBar;
