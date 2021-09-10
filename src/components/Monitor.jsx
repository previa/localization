/**
* The monitor component is the component that provides the
* visual interface situated on the monitor page.
* The page contains a table that is filled with the data that is shown
* on the map page in table format.
*
* @version 0.1
*/

'use strict'
import React, {Component} from 'react';
import ReactTable from 'react-table';
import Anchor from '../models/Anchor';
import Tag from '../models/Tag';
import Zone from '../models/Zone';

class Monitor extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="monitor_container">
        <input placeholder='&#xF002; search' onChange={(event)=>{this.search_item(event)}} type='text'/>
        <ul>
          <li><a onClick={() => {this.props.changeType(this.props.anchors, 'anchor')}} className={this.getTabCssClass('anchor')} href="#">Anchor</a></li>
          <li><a onClick={() => {this.props.changeType(this.props.tags, 'tag')}} className={this.getTabCssClass('tag')} href="#" >Tag</a></li>
          <li><a onClick={() => {this.props.changeType(this.props.zones, 'zone')}} className={this.getTabCssClass('zone')} href="#" >Zone</a></li>
        </ul>

        <ReactTable
          className="-striped"
          defaultPageSize={20}
          data={this.props.data}
          columns={this.props.columns}
        />
      </div>
    );
  }

  componentDidMount() {
    var that = this;
    this.props.getAnchors(function() {
      that.props.changeType(that.props.anchors, 'anchor');
    });
    this.props.getTags();
    this.props.getZones();
  }

  componentWillUnmount() {
    this.props.resetAnchors();
    this.props.resetZones();
    this.props.resetTags();
  }

  /**
  * Returns the correct CSS class for underlining the active tab,
  * by comparing to the current active element type.
  * @param {elementType} : The element type to compare to.
  */
  getTabCssClass(elementType) {
    return (this.props.type === elementType) ? 'active-tab' : 'unactive-tab';
  }

  /**
  * Event called when the searchfield is changed.
  * @param {event} the change event called when the inputfield is changed.
  */
  search_item(event){
    let reg = event.target.value;
    let regExp = new RegExp(reg, 'i');

    let data = [];
    if(this.props.type == 'anchor') {
      data = this.props.anchors;
    } else if (this.props.type == 'zone') {
      data = this.props.zones;
    } else if(this.props.type == 'tag') {
      data = this.props.tags;
    }

    let result_data = [];
    result_data = data.filter((item)=> {
      if(item.name.search(regExp) != -1) {
        return true;
      }
      return false;
    });

    this.props.changeType(result_data, this.props.type);
  }

}
export default Monitor;
