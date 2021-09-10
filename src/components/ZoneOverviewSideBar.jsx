import React, { Component } from 'react';
import FilterList from '../components/FilterList.jsx'
import Zone from '../models/Zone.js';
import vex from 'vex-js';
import vexdialog from 'vex-dialog';

class ZoneOverviewSideBar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div>
            <div id="filter_criteria">
              <div className="filter">
                <FilterList name="Zones" data={this.props.zones} editButton={1} iconName={"deleteButton"} editAction={(zone) => { this.deleteZone(zone); }} toggleAction={this.props.toggleAction}/>
              </div>
            </div>
            <div id="new-zone"><div onClick={(e) => { this.props.toggleZoneCreation(); }}>New zone ...</div></div>
          </div>
        );
    }

    deleteZone(zone) {
      var that = this;

      vex.dialog.buttons.YES.text = 'Delete';
      vex.dialog.buttons.NO.text = 'Cancel';
      vex.dialog.confirm({
          message: 'Are you sure you want to delete the zone \'' + zone.name + '\'?',
          callback: function (value) {
            if (value) {
              that.props.editAction(zone);
            }
          }
      });
    }
}

export default ZoneOverviewSideBar;
