import { connect } from 'react-redux';
import TagDetailsSideBar from '../components/TagDetailsSideBar.jsx';
import { closeTagDetails, addLabelsToTag } from '../actions/MapActions.jsx';

const mapStateToProps = (state, ownProps) => {
  return {
    tags: state.map.tags,
    currentTagMac: state.map.currentTagMac
  }
}

function fetchLabels(tagID, dispatch) {
  if(tagID !== 'undefined' && typeof tagID !== 'undefined') {
    fetch('api/tag/label/'+ tagID, {
      method: 'get',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(function(response) {
      if(response.status == 200) {
        response.json().then(function(data) {
          dispatch(addLabelsToTag(data));
        })
      }
    })
  }
}

function addLabelToTagInDB(label, tagID, dispatch) {
  fetch('api/tag/label/'+ tagID, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      labelID: label.labelID,
      name: label.name
    })
  }).then(function(response) {
    if(response.status == 204) {
      fetchLabels(tagID, dispatch);
    }
  })
}

function removeLabelFromTag(labelID, tagID, dispatch) {
  fetch('api/tag/label/'+tagID+'/'+ labelID, {
    method: 'delete',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  }).then(function(response) {
    if(response.status == 204) {
      fetchLabels(tagID, dispatch);
    }
  })
}

const mapDispatchToProps = (dispatch) => {
  return {
    closeTagDetails: () => {
      dispatch(closeTagDetails());
    },
    fetchLabels: (tagID) => {
      fetchLabels(tagID, dispatch);
    },
    addNewLabelToTag: (label, tagID) => {
      addLabelToTagInDB(label, tagID, dispatch);
    },
    removeLabelFromTag: (labelID, tagID) => {
      removeLabelFromTag(labelID, tagID, dispatch);
    },
    saveTagInfo: (tag) => {
      tag.updateThisInDB();
    }
  }
}

const TagDetailsSideBarContainer = connect(mapStateToProps,mapDispatchToProps)(TagDetailsSideBar)

export default TagDetailsSideBarContainer
