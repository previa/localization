export const addTag = (tag) => ({
  type: 'ADDTAG',
  tag
})

export const addAnchor = (anchor) => ({
  type: 'ADDANCHOR',
  anchor
})

export const addZone = (zone) => ({
  type: 'ADDZONE',
  zone
})

export const changeType = (data) => ({
  type: 'TYPECHANGE',
  data
})

export const addToData = (data) => ({
  type: 'ADDTODATA',
  data
})

export const resetData = () => ({
  type: 'RESETDATA'
})

export const addToColumn = (col) => ({
  type: 'ADDTOCOLUMN',
  col
})

export const resetColumns = () => ({
  type: 'RESETCOLUMNS'
})

export const resetTags = () => ({
  type: 'RESETTAGS'
})

export const resetAnchors = () => ({
  type: 'RESETANCHORS'
})

export const resetZones = () => ({
  type: 'RESETZONES'
})
