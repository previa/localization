import React, { Component } from 'react';
import TagDetailsSideBarContainer from '../containers/TagDetailsSideBarContainer.jsx';
import TagOverviewSideBar from '../components/TagOverviewSideBar.jsx';

class LeftSideBar extends Component {
    render() {
        var that = this;

        return (
            <aside className="sidebar">
                {that.props.tagDetailsOpen ?
                  <TagDetailsSideBarContainer/> :
                  <TagOverviewSideBar devices={this.props.tags} tagToggleAction={this.props.toggleSingleDeviceVisibility} EditTag={function(element) { that.props.openTagDetail(element); }}/>
                }
            </aside>
        );
    }
}

export default LeftSideBar;
