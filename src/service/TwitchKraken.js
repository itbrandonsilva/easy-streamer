'use strict';

import * as superagent from 'superagent';
import {
    Linking
} from 'react-native';

const ERROR = {
    NO_TOKEN: new Error('Must set accessToken using TwitchKraken.setToken(<token>).'),
}

const CLIENT_ID = 'lt13rtyun6sn437g4zot2vhq05b4vaq';
const REDIRECT_URI = 'silva.estream.client://oauth';

const BASE_URL = 'https://api.twitch.tv/kraken';
const CLIENT_ID_PARAM = 'client_id=' + CLIENT_ID;

const URLS = {
    games: (limit) => {
        limit = limit || 50;
        return `${BASE_URL}/games/top?limit=${limit}&${CLIENT_ID_PARAM}`;
    },
    streams: (game) => {
        let gameParam = game ? '&game=' + game : '';
        return `${BASE_URL}/streams?limit=15${gameParam}&${CLIENT_ID_PARAM}`;
    }
}

class TwitchKraken {
    constructor() {
        //let headers = new Headers();
        //this._fetchInit  = { headers };
    }

    auth() {
        Linking.openURL([
            'https://api.twitch.tv/kraken/oauth2/authorize',
            '?response_type=token',
            '&client_id=' + CLIENT_ID,
            '&redirect_uri=' + REDIRECT_URI
        ].join());
    }

    setToken(token) {
        //let headers = new Headers();
        //headers.append('Authorization', ' OAuth ' + token);
        //this._fetchInit = { headers };
    }

    getGames() {
        return new Promise((resolve, reject) => {
            superagent.get(URLS.games()).end(
                (err, res) => {
                    resolve(res.body);
                }
            );
        });
    }

    getStreams(game) {
        return new Promise((resolve, reject) => {
            superagent.get(URLS.streams(game)).end(
                (err, res) => {
                    resolve(res.body);
                }
            );
        });
    }
}

let API = new TwitchKraken();
export { API };
