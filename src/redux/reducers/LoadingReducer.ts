export const LoadingReducer = (prevState = {
    loading: false
}, action: { type: any; payload: any }) => {
    const { type, payload } = action
    switch (type) {
        case 'CHANGE_LOADING':
            let newState = { ...prevState }
            newState.loading = payload
            return newState
        default: return prevState
    }
}
