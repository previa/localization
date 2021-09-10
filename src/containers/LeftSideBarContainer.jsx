import { connect } from 'react-redux'
import LeftSideBar from '../components/LeftSideBar.jsx';
import { openTagDetails, toggleSingleDeviceVisibility } from '../actions/MapActions.jsx'

const mapStateToProps = (state, ownProps) => {
  return {
    tagDetailsOpen: state.map.tagDetailsOpen,
    tagID: state.map.tagInfo === null ? null : state.map.tagInfo.tagID,
    tagLabels: state.map.tagInfo === null ? null : state.map.tagInfo.labels,
    tags: state.map.tags
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openTagDetail: (tag) => {
      dispatch(openTagDetails(tag));
    },
    toggleSingleDeviceVisibility: (element) => {
      dispatch(toggleSingleDeviceVisibility(element));
    }
  }
}

const LeftSideBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftSideBar)

export default LeftSideBarContainer
