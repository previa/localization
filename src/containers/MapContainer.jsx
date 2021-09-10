import { connect } from 'react-redux'
import Map from '../components/Map.jsx';
import { addZone, openTagDetails, anchorsLoaded, toggleZoneCreation, addTag, closeTagDetails, addAnchor, clearZones, renderGrid, toggleTagsLoaded, resetZones, resetAnchors, resetTags } from '../actions/MapActions.jsx'
import Anchor from '../models/Anchor'
import Zone from '../models/Zone'
import Tag from '../models/Tag'

const mapStateToProps = (state, ownProps) => {
  return {
    zones: state.map.zones,
    anchors:state.map.anchors,
    tags: state.map.tags,
    visibilityGrid: state.map.visibilityGrid,
    visibilityZones: state.map.visibilityZones,
    visibilityAnchors: state.map.visibilityAnchors,
    visibilityDevices: state.map.visibilityDevices,
    tagID: state.map.tagInfo === null ? null : state.map.tagInfo.tagID,
    createZone: state.map.createNewZone,
    currentTagMac: state.map.currentTagMac,
    grid: state.map.grid,
    tagsLoaded: state.map.tagsLoaded
  };
}

function getAnchors(environmentID, dispatch) {
  fetch('api/environment/anchor/' + environmentID).then(function(response) {
      if(response.status !== 200) {
        console.log("Looks like there was a problem. Status Code: " + response.status);
      } else {
        response.json().then(function(data) {
          data.forEach(function(element){
            let temp_anchor = new Anchor(element.anchorID, element.name, element.environmentID,element.hardwareVersion, element.firmwareVersion, element.x,element.y,element.z, element.last_seen, element.status);
            temp_anchor.paintAnchor();
            dispatch(addAnchor(temp_anchor));
          });
        });
      }
    });
}

function getTags(environmentID, dispatch) {
  dispatch(toggleTagsLoaded(false));
  fetch('api/environment/tag/' + environmentID).then(function(response) {
      if(response.status !== 200) {
        console.log("Looks like there was a problem. Status Code: " + response.status);
      } else {
        response.json().then(function(data) {
          data.forEach(function(element) {
            var temp_tag = new Tag(element.tagID, null, element.name, element.hardwareVersion, element.firmwareVersion, element.batteryLevel, element.updateRate, element.iconPath, element.iconColor, element.environmentID, element.mac);
            dispatch(addTag(temp_tag));
          });
          dispatch(toggleTagsLoaded(true));
        });
      }
    });
}

/* Fetch zones */
function getZones(environmentId, dispatch) {
  var zones = [];
  fetch('api/environment/zone/'+ environmentId)
  .then(res => res.json())
  .then((json) => {
    Promise.all(
      json.map(
        element => fetch('api/zone/point/' + element.zoneID)
        .then(res => res.json())
        )
      ).then(datas => {
        json.forEach((element, i) => {
          zones[element.zoneID] = element;
          zones[element.zoneID].points = datas[i];
        });

        zones.forEach(function(response){
          if(response != undefined || response.points != undefined) {
            var temp_zone = new Zone(response.zoneID, response.environmentID,response.name,response.area,response.points);
            temp_zone.createPathFromPoints();
            dispatch(addZone(temp_zone));
          }
        });
      })
    });
}

const mapDispatchToProps = (dispatch) => {
  return {
    addZone: (zone) => {
      dispatch(addZone(zone));
    },
    openTagDetail: (id) => {
      dispatch(openTagDetails(id));
    },
    closeTagDetails: () => {
      dispatch(closeTagDetails());
    },
    toggleZoneCreation: () => {
      dispatch(toggleZoneCreation());
    },
    addTag: (tag) => {
      dispatch(addTag(tag))
    },
    getAnchors: (environmentID) => {
      getAnchors(environmentID, dispatch);
    },
    getZones: (environmentID) => {
      dispatch(clearZones());
      getZones(environmentID, dispatch);
    },
    getTags: (environmentID) => {
      getTags(environmentID, dispatch);
    },
    renderGrid: (grid) => {
      dispatch(renderGrid(grid));
    },
    toggleTagsLoaded: (val) => {
      dispatch(toggleTagsLoaded(val));
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

const MapContainer = connect(
  mapStateToProps,
  mapDispatchToProps
  )(Map)

  export default MapContainer
