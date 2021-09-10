const initialState = {
  tagDetailsOpen: false,
  tagInfo: null,
  tags: [],
  anchors: [],
  zones: [],
  visibilityGrid: true,
  visibilityZones: true,
  visibilityAnchors: true,
  visibilityDevices: true,
  createNewZone: false,
  currentTagMac: null,
  grid: null,
  tagsLoaded: true
  //TODO: Current environmetn id ? or global?
  //environemtn : 1
}

// The map reducer manages the state of the /map page.
// The side bar can be open or closed, ...

function map(state = initialState, action) {
  switch (action.type) {
    case 'OPENTAGDETAILS':
      state.tags[action.tag.mac].selected(!state.tagDetailsOpen);
      return Object.assign({}, state, {
        tagDetailsOpen: true,
        currentTagMac: action.tag.mac
      })
      case 'CLOSETAGDETAILS':
        state.tags[state.currentTagMac].selected(!state.tagDetailsOpen);
        return Object.assign({}, state, {
          tagDetailsOpen: false,
          currentTagMac: null
        })
      case 'ADDZONE':
        return Object.assign({}, state, {
          zones: [...state.zones, action.zone]
        })
      case 'ADDANCHOR':
        return Object.assign({}, state, {
          anchors: [...state.anchors, action.anchor]
        })
      case 'ADDTAG':
        return Object.assign({}, state, {
          tags: {
            ...state.tags,
            [action.tag.mac]: action.tag
          }
        })
      case 'TOGGLESINGLEDEVICEVISIBILITY':
        state.tags[action.element.mac].setVisible(!state.tags[action.element.mac].visible);
        return {
          ...state
        }
      case 'TOGGLESINGLEZONEVISIBILITY':
        state.zones[action.index].setVisible(!state.zones[action.index].visible);
        return {
          ...state
        }
      case 'TOGGLEGRIDVISIBILITY':
        state.visibilityGrid = !state.visibilityGrid;
        state.grid.setVisible(state.visibilityGrid);
        return Object.assign({}, state, {
          visibilityGrid: state.visibilityGrid
        })
      case 'TOGGLEANCHORSVISIBILITY':
        state.visibilityAnchors = !state.visibilityAnchors;
        state.anchors.forEach(function(element) {
          element.setVisible(state.visibilityAnchors);
        });
        return Object.assign({}, state, {
          visibilityAnchors: state.visibilityAnchors
        })
      case 'TOGGLEDEVICESVISIBILITY':
        state.visibilityDevices = !state.visibilityDevices;
        for(var key in state.tags) {
          state.tags[key].setVisible(state.visibilityDevices);
        }
        return {
          ...state
        }
      case 'TOGGLEZONESVISIBILITY':
        state.visibilityZones = !state.visibilityZones;
        state.zones.forEach(function(element) {
          element.setVisible(state.visibilityZones);
        });
        return Object.assign({}, state, {
          visibilityZones: state.visibilityZones
        })
      case 'ADDLABELSTOTAG':
        return Object.assign({}, state, {
          tags: {
            ...state.tags,
            [state.currentTagMac]: {
              ...state.tags[state.currentTagMac],
              labels: action.labels
            }
          }
        })
       case 'TOGGLEZONECREATION':
         return Object.assign({}, state, {
           createNewZone: !state.createNewZone
         })
       case 'CLEARZONES':
        state.zones.forEach(function(element) {
          element.removePath();
        });
        return Object.assign({}, state, {
          zones: []
        })
      case 'RENDERGRID':
        state.grid = action.grid;
        state.grid.renderGrid(30,30);
        return Object.assign({}, state, {
          grid: state.grid
        })
      case 'TOGGLETAGSLOADED':
        return Object.assign({}, state, {
          tagsLoaded: action.val
        })
      case 'RESETZONES':
        return Object.assign({}, state, {
          zones: []
        })
      case 'RESETTAGS':
        return Object.assign({}, state, {
          tags: []
        })
      case 'RESETANCHORS':
        return Object.assign({}, state, {
          anchors: []
        })
    default:
      return state;
  }
}

export default map
