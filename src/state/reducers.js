import * as Immutable from 'immutable';

const DEFAULT = Immutable.fromJS({
    navState: {
        view: '_starting_up',
    },
    settings: {
        quality: 3
    },
    drawerOpen: false,
    hostIpAddress: null,
    modalState: null,
});

const VALID_VIEWS = ['top_games', 'top_streams', 'settings', 'loading'];

function reducer(store = DEFAULT, action) {
    switch (action.type) {
        case 'SET_SETTINGS_QUALITY':
            return store.setIn(['settings', 'quality'], action.quality);
        case 'SET_HOST_ADDRESS':
            return store.set('hostIpAddress', action.ipAddress);
        case 'SET_NAV_STATE':
            if (VALID_VIEWS.indexOf(action.navState.view) === -1) throw new Error('Application attempted to set navState to invalid view "' + action.navState.view + '"');
            store = store.set('drawerOpen', false);
            return store.set('navState', Immutable.fromJS(action.navState));
        case 'TOGGLE_DRAWER':
            return store.set('drawerOpen', !store.get('drawerOpen'));
        case 'OPEN_DRAWER':
            return store.set('drawerOpen', true);
        case 'CLOSE_DRAWER':
            return store.set('drawerOpen', false);
        default:
            return store;
    }
}

export { reducer };
