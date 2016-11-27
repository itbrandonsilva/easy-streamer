import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { reducer } from './reducers.js';
import { API } from '../service/TwitchKraken.js';

const store = createStore(
    reducer,
    applyMiddleware(thunk.withExtraArgument(API))
);

export { store };
