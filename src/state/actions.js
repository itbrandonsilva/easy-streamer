import { Network } from '../service/Network.js';

export function actionSetNavView(view, params) {
    params = params || {};

    return (dispatch, getState, API) => {
        switch (view) {
            case 'loading':
                if (getState().getIn(['navState', 'view']) === '_starting_up') return;
            case 'settings':
                return dispatch({type: 'SET_NAV_STATE', navState: {view}});
        }

        dispatch({type: 'SET_NAV_STATE', navState: {view: 'loading'}});
        switch (view) {
            case 'top_streams':
                API.getStreams(params.game).then(
                    res => dispatch({type: 'SET_NAV_STATE', navState: {view, streams: res.streams}}),
                    err => { throw err }
                );
                break;
            case 'top_games':
                API.getGames().then(
                    res => dispatch({type: 'SET_NAV_STATE', navState: {view, games: res.top}}),
                    err => { throw err }
                );
                break;
        }
    }
}

export function actionToggleDrawer() {
    return {type: 'TOGGLE_DRAWER'};
}

export function actionOpenDrawer() {
    return {type: 'OPEN_DRAWER'};
}

export function actionCloseDrawer() {
    return {type: 'CLOSE_DRAWER'};
}

export function actionSetHostAddress(ipAddress) {
    return {type: 'SET_HOST_ADDRESS', ipAddress};
}

export function actionSetSettingsQuality(quality) {
    return {type: 'SET_SETTINGS_QUALITY', quality};
}

export function actionDiscoverHost() {
    return (dispatch, getState) => {
        dispatch(actionSetNavView('loading'));
        Network.discover().then(ipAddress => {
            dispatch(actionSetHostAddress(ipAddress));
            if (ipAddress) dispatch(actionSetNavView('top_games'));
            else dispatch(actionSetNavView('settings'));
        });
    }
}
