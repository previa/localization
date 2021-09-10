import { ElementType } from '../components/Monitor.jsx'

const initialState = {
  tags: [],
  anchors: [],
  zones: [],
  data: [],
  type: 'anchor',
  columns: []
}

/**
  The monitorreducer is responsible for managing the state
  of the monitor page. This page shows a table form of the data
  provided in the current environment.
*/
function monitor(state = initialState, action){
  switch (action.type) {
    case 'ADDTAG':
      return Object.assign({}, state, {
        tags: [...state.tags, action.tag]
      })
    case 'ADDANCHOR':
      return Object.assign({}, state, {
        anchors: [...state.anchors, action.anchor]
      })
    case 'ADDZONE':
      return Object.assign({}, state, {
        zones: [...state.zones, action.zone]
      })
    case 'TYPECHANGE':
      return Object.assign({}, state, {
        type: action.data
      })
    case 'ADDTODATA':
      return Object.assign({}, state, {
        data: [...state.data, action.data]
      })
    case 'RESETDATA':
      return Object.assign({}, state, {
        data: []
      })
    case 'ADDTOCOLUMN':
      return Object.assign({}, state, {
        columns: [...state.columns, action.col]
      })
    case 'RESETCOLUMNS':
      return Object.assign({}, state, {
        columns: []
      });
    case 'RESETTAGS':
      return Object.assign({}, state, {
        tags: []
      })
    case 'RESETANCHORS':
      return Object.assign({}, state, {
        anchors: []
      })
    case 'RESETZONES':
      return Object.assign({}, state, {
        zones: []
      })
    default:
      return state;
  }
}

export default monitor;
