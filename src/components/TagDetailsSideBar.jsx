import React, {Component} from 'react';
import { closeTagDetails } from '../actions/MapActions.jsx'
import Config from '../../config/config.js'
import Label from '../models/Label'

class TagDetailsSideBar extends Component {

    render() {

        return (
            <div className="detail_tag_info_container">
              <div className="close_button_container">
                <img src={Config.getImage("closeButton")} alt="close" width="12px" height="12px"
                  className="close_button" onClick={this.props.closeTagDetails}/>
              </div>
              <div className="detail_tag_info">
                <div className="status_container">
                  <img className="status_tag_image" src={this.props.tags[this.props.currentTagMac].online ? Config.getPublicImage("online_tag.png") : Config.getPublicImage("offline_tag.png")} alt="tag_icon" width="30px" height="30px" />
                  <span className="status_status_label">Status:</span>
                  <span className="status_status_state_label">{this.props.tags[this.props.currentTagMac].online ? 'Online' : 'Offline' }</span>
                </div>
                <div className="name_container">
                  <label>TAG:</label>
                  <input type="text" readOnly="readonly" value={this.props.tags[this.props.currentTagMac].name} />
                </div>
                <div className="label_container">
                  <label>Labels</label>
                  <input placeholder="Add new label" id="add_new_label" type="text" />
                  {
                    this.props.tags[this.props.currentTagMac].labels.length != 0 ? this.props.tags[this.props.currentTagMac].labels.map(label => (
                      <div className="label_container_list" key={label.labelID}>
                        <img src={Config.getImage('closeButton')} width="12px" height="12px" onClick={() => this.props.removeLabelFromTag(label.labelID, this.props.tags[this.props.currentTagMac].tagID)}/>
                        <label>{label.name}</label>
                      </div>
                    )) : <div className="no-label-message">This tag has no labels assigned yet.</div>
                  }
                </div>
                <div className="color_icon_container">
                  <div className="color_icon_container_item">
                    <span className="color_icon_container_item_first" id="color_icon_container_color_value" onClick={(e) => this.pickColor(e)}></span>
                    <input type="color" id="color_picker" onChange={(val) => this.colorChanged(val)}/>
                    <label>Color</label>
                  </div>
                  <div className="color_icon_container_item">
                    <img className="color_icon_container_item_first" src={Config.getPublicImage(this.props.tags[this.props.currentTagMac].iconPath)} alt="tag_icon" width="25px" height="25px" />
                    <label>Icon</label>
                  </div>
                </div>
              </div>
            </div>);
    }

    componentDidMount() {
      var that = this;
      this.props.fetchLabels(that.props.tags[that.props.currentTagMac].tagID);

      document.getElementById('color_icon_container_color_value').style.backgroundColor = this.props.tags[this.props.currentTagMac].iconColor;

      document.getElementById('add_new_label').addEventListener("keyup", function(event) {
        if(event.keyCode == 13) {
          that.props.addNewLabelToTag(new Label(null, document.getElementById('add_new_label').value), that.props.tags[that.props.currentTagMac].tagID);
          document.getElementById('add_new_label').value = "";
        }
      });
    }

    pickColor(event) {
      document.getElementById('color_picker').click();
    }

    colorChanged(val) {
      console.log(document.getElementById('color_picker').value);
      this.props.tags[this.props.currentTagMac].setColor(document.getElementById('color_picker').value);
      document.getElementById('color_icon_container_color_value').style.backgroundColor = document.getElementById('color_picker').value;
      this.props.saveTagInfo(this.props.tags[this.props.currentTagMac]);
    }
}

//These lines will do the dependency injection for the Redux store!
TagDetailsSideBar.contextTypes = {
	store: React.PropTypes.object
}

export default TagDetailsSideBar;
