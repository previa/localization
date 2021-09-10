import LoginReducer from '../src/reducers/LoginReducer.jsx'
import MapReducer from '../src/reducers/MapReducer.jsx'

describe('map reducer', () => {
  it('should return the initial state', () => {
    expect(
      MapReducer(undefined, {})
    ).toEqual(
      {
        tagDetailsOpen: false,
        tagInfo: null
      }
    )
  })

  it('should handle OPENTAGDETAILS', () => {
    expect(
      MapReducer([], {
        type: "OPENTAGDETAILS",
        tag: {
          name: "tagname"
        }
      })
    ).toEqual(
        {
          tagDetailsOpen: true,
          tagInfo: {
            name: "tagname"
          }
        }
    )
  })

  it('should handle CLOSETAGDETAILS', () => {
    expect(
      MapReducer(
          {
            tagDetailsOpen: true,
            tagInfo: {
              name: "tagname"
            }
          }, {
        type: "CLOSETAGDETAILS"
      })
    ).toEqual(
        {
          tagDetailsOpen: false,
          tagInfo: null
        }
    )
  })
})

describe('login reducer', () => {
  it('should return the initial state', () => {
    expect(
      LoginReducer(undefined, {})
    ).toEqual(
      {
        loggedIn: false
      }
    )
  })

  it('should handle LOGOUT', () => {
    expect(
      LoginReducer([], {
        type: "LOGOUT"
      })
    ).toEqual(
        {
          loggedIn: false
        }
    )

    expect(
      LoginReducer(
        {
          loggedIn: true
        }
        ,
        {
          type: "LOGOUT"
        }
      )
    ).toEqual(
        {
          loggedIn: false
        }
    )
  })

  it('should handle LOGIN', () => {
    expect(
      LoginReducer([], {
        type: "LOGIN"
      })
    ).toEqual(
        {
          loggedIn: true
        }
    )

  })
})
