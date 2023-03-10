export const CollapsedReducer = (prevState = {
  collapsed: false
}, action: { type: any, payload: any }) => {
  const { type, payload } = action
  switch (type) {
    case 'CHANGE_COLLAPSED':
      let newState = { ...prevState }
      newState.collapsed = payload
      return newState
    default: return prevState
  }
}
