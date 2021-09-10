import React, {Component} from 'react';
import Config from '../../config/config.js';

class FilterListItems extends Component {

    render() {
      var that = this;
      return (
        <div>
          {
              Object.keys(this.props.data).map(function(key, index) {
                let element = this.props.data[key];
                return (<div className="filter_element" key={element.name}>
                        <div className="checkbox">
                          <input id={element.name + '_filter_id'} className="checkbox-custom" name="checkbox-1" type="checkbox" defaultChecked
                                onChange={(e) => { that.props.toggleAction(element, index); }} />

                          <label htmlFor={element.name + '_filter_id'} className="checkbox-custom-label">{element.name}</label>
                        </div>
                        { !that.props.editButton ? <label></label> :
                          <div className="edit">
                            <span className="filter_edit_button_helper"></span>
                            <img className="filter_edit_button" src={Config.getImage(that.props.iconName)} alt="edit" width="15px" height="15px"
                              onClick={function(event) { var el = element; that.props.editAction(el); }} />
                          </div>
                        }
                      </div>);
            }.bind(that))
          }
        </div>
      );
    }
}

export default FilterListItems;
