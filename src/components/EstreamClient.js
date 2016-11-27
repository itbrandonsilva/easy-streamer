import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Linking } from 'react-native';

import { store } from '../state/store.js';
import { AppView } from './index.js';


export class EstreamClient extends Component {
    render() { 
        return (
            <Provider store={store}>
                <AppView></AppView>
            </Provider>
        );
    }
}
