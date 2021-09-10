import { connect } from 'react-redux';
import VisibilityOverviewSideBar from '../components/VisibilityOverviewSideBar.jsx';
import { toggleGridVisibility, toggleAnchorsVisibility, toggleZonesVisibility, toggleDevicesVisibility } from '../actions/MapActions.jsx';

const mapStateToProps = (state, ownProps) => {
  return {
    visibilityGrid: state.map.visibilityGrid,
    visibilityZones: state.map.visibilityZones,
    visibilityAnchors: state.map.visibilityAnchors,
    visibilityDevices: state.map.visibilityDevices
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleGridVisibility: () => {
      dispatch(toggleGridVisibility());
    },
    toggleAnchorsVisibility: () => {
      dispatch(toggleAnchorsVisibility());
    },
    toggleZonesVisibility: () => {
      dispatch(toggleZonesVisibility());
    },
    toggleDevicesVisibility: () => {
      dispatch(toggleDevicesVisibility());
    },
    toggleGlobalVisibility: (element) => {
      switch(element.name) {
        case 'Grid':
          dispatch(toggleGridVisibility());
          break;
        case 'Devices':
          dispatch(toggleDevicesVisibility());
          break;
        case 'Zones':
          dispatch(toggleZonesVisibility());
          break;
        case 'Anchors':
          dispatch(toggleAnchorsVisibility());
      }
    }
  }
}

const VisibilityOverviewSideBarContainer = connect(mapStateToProps,mapDispatchToProps)(VisibilityOverviewSideBar)

export default VisibilityOverviewSideBarContainer
