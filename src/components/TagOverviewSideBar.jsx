import React, { Component } from 'react';
import FilterList from '../components/FilterList.jsx'

class TagOverviewSideBar extends Component {
    render() {
        var tag_labels = [{ name: 'Family' }, { name: 'Person' }, { name: 'Male' }, { name: 'Female' }];

        return (
          <div>
            <div id="filter_criteria">
              <div className="filter">
                <FilterList name="Tags" toggleAction={this.props.tagToggleAction} data={this.props.devices} editButton={1} iconName={'editButton'} editAction={this.props.EditTag} />
              </div>
            </div>
          </div>
        );
    }
}

export default TagOverviewSideBar;
