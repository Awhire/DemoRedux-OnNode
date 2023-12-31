const redux = require('redux')
const thunkMiddleware = require('redux-thunk').default
const axios = require('axios')
const createStore = redux.createStore
const applyMiddleware = redux.applyMiddleware



const initialState = {
    loading: false,
    users: [],
    error: '',
}

const FETCH_USER_REQUESTED = "FETCH_USER_REQUESTED"
const FETCH_USER_SUCCEDED = "FETCH_USER_SUCCEDED"
const FETCH_USER_FAILED = "FETCH_USER_FAILED"

const fetchUserRequest = () => {
    return {
        type: FETCH_USER_REQUESTED, 
    }
}

const fetchUserSuccess = (users) => {
    return {
        type: FETCH_USER_SUCCEDED,
        payload: users,
    }
}

const fetchUserFailed = (error) => {
    return {
        type: FETCH_USER_FAILED,
        payload: error,
    }
}


const reducer = (state = initialState, action) => {
    switch(action.type) {
        case FETCH_USER_REQUESTED:
            return {
                ...state,
                loading: true
            }
        case FETCH_USER_SUCCEDED:
            return {
                loading: false,
                users: action.payload,
                error: ""
            }
        case FETCH_USER_FAILED:
            return {
                loading: false,
                users: [],
                error: action.payload
            }
    }
}

const fetchUsers = () => {
    return function(dispatch) {
        dispatch(fetchUserRequest())
        axios.get("https://jsonplaceholder.typicode.com/users")
        .then(res => {
            // response.data is the users
            const users = res.data.map(user => user.id)
            dispatch(fetchUserSuccess(users))
        })
        .catch(error => {
            // error.message is the error msg
            dispatch(fetchUserFailed(error.message))
        })
    }
}


const store = createStore(reducer, applyMiddleware(thunkMiddleware))

store.subscribe(() => { console.log(store.getState()) })
store.dispatch(fetchUsers())

