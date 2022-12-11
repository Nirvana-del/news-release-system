export const BreadCrumbReducer = (prevState = {
    navItems: [] as string[]
}, action: { type: string, payload: string[] }) => {
    const { type, payload } = action
    switch (type) {
        case 'CHANGE_PAGE':
            let newState = { ...prevState }
            newState.navItems = payload
            return newState
        default: return prevState
    }
}
