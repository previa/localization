import { connect } from 'react-redux'
import RightSideBar from '../components/RightSideBar.jsx';
import { toggleZoneVisibility, toggleZoneCreation, toggleSingleZoneVisibility, clearZones, addZone } from '../actions/MapActions.jsx'
import Zone from '../models/Zone.js';

const mapStateToProps = (state, ownProps) => {
  return { zones: state.map.zones };
}

/* Fetch zones */
function getZones(environmentId, dispatch) {
  console.log('Getting zones');
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

function removeZone(zone, dispatch) {
  console.log('Removing Zones');
  fetch('api/zone/' + zone.zoneID, {
    method: 'delete',
  }).then(function(response){
    if(response.status == 204) {
      dispatch(clearZones());
      getZones(1, dispatch);
    }
  });
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleZoneVisibility: (zone) => {
      dispatch(toggleZoneVisibility(zone));
    },
    toggleZoneCreation: () => {
      dispatch(toggleZoneCreation());
    },
    toggleSingleZoneVisibility: (element, index) => {
      dispatch(toggleSingleZoneVisibility(element, index));
    },
    removeZone: (zone) => {
      removeZone(zone,dispatch);
    }
  }
}

const RightSideBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
  )(RightSideBar)

export default RightSideBarContainer
