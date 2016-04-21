import {reducerBuilder} from '../../reducers/reducer-builder';
import {loadMixedTypes} from '../actions/user-actions';

//types to use
// question here is should loadUserTypes be more like {request, receive} instead of {REQUEST_LOAD_USER, RESPONSE_LOAD_USER}
// I prefer the things as they are now but I would like your opinion @BernardStanislas and @Tommass
const {REQUEST_LOAD_ADDRESS, RESPONSE_LOAD_ADDRESS, ERROR_LOAD_ADDRESS} = loadMixedTypes;

// default data
const DEFAULT_DATA = {
    city: 'Libercourt'
};

// Reducer for the user entity with a state modification on load and save.
const userReducer = reducerBuilder({
    types: {
        load: {request: REQUEST_LOAD_ADDRESS, response: RESPONSE_LOAD_ADDRESS, error: ERROR_LOAD_ADDRESS},
        //todo: this is an error i need a save but i shouldn't
        save: {request: REQUEST_LOAD_ADDRESS, response: RESPONSE_LOAD_ADDRESS, error: ERROR_LOAD_ADDRESS}
    },
    defaultData: DEFAULT_DATA
});

export default userReducer;
