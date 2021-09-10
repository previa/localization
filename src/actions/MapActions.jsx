export const openTagDetails = (tag) => ({
  type: 'OPENTAGDETAILS',
  tag
})

export const closeTagDetails = () => ({
  type: 'CLOSETAGDETAILS'
})

export const anchorsLoaded = (anchors) => ({
  type: 'ANCHORSLOADED',
  anchors
})

export const zonesLoaded = (zones) => ({
  type: 'ZONESLOADED',
  zones
})

export const addZone = (zone) => ({
  type: 'ADDZONE',
  zone
})

export const addTag = (tag) => ({
  type: 'ADDTAG',
  tag
})

export const addAnchor = (anchor) => ({
  type: 'ADDANCHOR',
  anchor
})

export const toggleSingleDeviceVisibility = (element) => ({
  type: 'TOGGLESINGLEDEVICEVISIBILITY',
  element
})

export const toggleSingleZoneVisibility = (element, index) => ({
  type: 'TOGGLESINGLEZONEVISIBILITY',
  element,
  index
})

//Global visibilities
export const toggleGridVisibility = () => ({
  type: 'TOGGLEGRIDVISIBILITY'
})

export const toggleAnchorsVisibility = () => ({
  type: 'TOGGLEANCHORSVISIBILITY'
})

export const toggleZonesVisibility = () => ({
  type: 'TOGGLEZONESVISIBILITY'
})

export const toggleDevicesVisibility = () => ({
  type: 'TOGGLEDEVICESVISIBILITY'
})

export const addLabelsToTag = (labels) => ({
  type: 'ADDLABELSTOTAG',
  labels
})

export const toggleZoneCreation = () => ({
  type: 'TOGGLEZONECREATION'
})

export const toggleTagsLoaded = (val) => ({
  type: 'TOGGLETAGSLOADED',
  val
})

export const clearZones = () => ({
  type: 'CLEARZONES'
})

export const renderGrid = (grid) => ({
  type: 'RENDERGRID',
  grid
})

export const resetAnchors = () => ({
  type: 'RESETANCHORS'
})

export const resetTags = () => ({
  type: 'RESETTAGS'
})

export const resetZones = () => ({
  type: 'RESETZONES'
})
