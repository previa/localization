import React, { Component } from 'react';
import FilterList from '../components/FilterList.jsx';

class VisibilityOverviewSideBar extends Component {
    constructor(props) {
      super(props);
    }

    render() {
      var visibility_options = [{name: 'Grid'}, {name: 'Anchors'}, {name: 'Zones'}, {name: 'Devices'}];
      return (
        <div>
          <div id="filter_criteria">
            <div className="filter">
              <FilterList name="General" data={visibility_options} editButton={0} editAction={null} toggleAction={this.props.toggleGlobalVisibility}/>
            </div>
          </div>
        </div>
      );
    }
}

export default VisibilityOverviewSideBar;
