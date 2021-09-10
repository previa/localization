import { connect } from 'react-redux'
import Monitor from '../components/Monitor.jsx';
import { addTag, addAnchor, addZone, changeType, addToData, resetData, addToColumn, resetColumns, resetTags, resetAnchors, resetZones } from '../actions/MonitorActions.jsx'
import Tag from '../models/Tag.js'
import Anchor from '../models/Anchor.js'
import Zone from '../models/Zone.js'

/**
  Getting the prop for the selected type. The type depends on the
  elements that need to be shown in the table. For example: anchors, tags, ...
  @param {state} the state to get the values from.
  @param {ownProps} the props owned by this type.
*/
const mapStateToProps = (state, ownProps) => {
  return {
    tags: state.monitor.tags,
    zones: state.monitor.zones,
    anchors: state.monitor.anchors,
    data: state.monitor.data,
    type: state.monitor.type,
    columns: state.monitor.columns
  };
}

function getTags(dispatch) {
  fetch('api/tag').then(function(response) {
      if(response.status !== 200) {
        console.log("Looks like there was a problem. Status Code: " + response.status);
      } else {
        response.json().then(function(data) {
              data.forEach(function(element){
                var temp_tag = new Tag(element.tagID,
                  null,
                  element.name,
                  element.hardwareVersion,
                  element.firmwareVersion,
                  element.batteryLevel,
                  element.updateRate,
                  element.iconPath,
                  element.iconColor,
                  element.environmentID,
                  element.mac);

                  dispatch(addTag(temp_tag));
              });
            });
      }
    });
}

function getAnchors(callback, dispatch) {
  fetch('api/anchor').then(function(response) {
      if(response.status !== 200) {
        console.log("Looks like there was a problem. Status Code: " + response.status);
      } else {
        response.json().then(function(data) {
              data.forEach(function(element){
                var temp_anchor = new Anchor(
                  element.anchorID,
                  element.name,
                  element.environmentID,
                  element.hardwareVersion,
                  element.firmwareVersion,
                  element.x,
                  element.y,
                  element.z,
                  element.last_seen,
                  element.status);

                  dispatch(addAnchor(temp_anchor));
              });
              callback();
            });
      }
    });
}

function getZones(dispatch) {
  fetch('api/environment/zone/1').then(function(response) {
      if(response.status !== 200) {
        console.log("Looks like there was a problem. Status Code: " + response.status);
      } else {
        response.json().then(function(data) {
              data.forEach(function(element) {
                var temp_zone = new Zone(
                  element.zoneID,
                  element.environmentID,
                  element.name,
                  element.area
                );
                temp_zone.visible = false;

                dispatch(addZone(temp_zone));
              });
            });
      }
    });
}


const mapDispatchToProps = (dispatch) => {
  return {
    getTags:() => {
      dispatch(resetTags());
      getTags(dispatch);
    },
    getAnchors: (callback) => {
      dispatch(resetAnchors());
      getAnchors(callback, dispatch);
    },
    getZones: () => {
      dispatch(resetZones());
      getZones(dispatch);
    },
    changeType:(data, type) => {
      dispatch(changeType(type));
      dispatch(resetData());
      data.forEach(function(element) {
        dispatch(addToData(element));
      });

      if(data.length > 0) {
        dispatch(resetColumns());
        data[0].createColumns().forEach(function(element) {
          dispatch(addToColumn(element));
        });
      }
    },
    resetZones: () => {
      dispatch(resetZones());
    },
    resetAnchors: () => {
      dispatch(resetAnchors());
    },
    resetTags: () => {
      dispatch(resetTags());
    }
  }
}

const MonitorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Monitor)

export default MonitorContainer
