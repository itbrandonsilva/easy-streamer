import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import {
    Text,
    View,
    ScrollView,
} from 'react-native';

import { AppViewContentLoading, AppViewContentChannels, AppViewContentSettings, AppViewContentGames } from './index.js';
import { actionSetNavView, actionToggleDrawer } from '../state/actions.js';

class AppViewContent extends Component {
    render() { 
        let view = null;
        switch (this.props.view) {
            case 'loading':
            case '_starting_up':
                view = (<AppViewContentLoading />);
                break;
            case 'top_streams':
                view = (<AppViewContentChannels />);
                break;
            case 'top_games':
                view = (<AppViewContentGames />);
                break;
            case 'settings':
                view = (<AppViewContentSettings />);
                break;
        }

        let viewTitle = this.props.view.split('_').join(' ')
            .replace(/\w\S*/g, txt => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });

        return (
            <View style={{flex: 1}}>
                <View style={{height: 50, alignSelf: 'stretch', backgroundColor: '#6441a4', paddingLeft: 20}}>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <Icon name={'bars'} color={'#ffffff'} type={'font-awesome'} onPress={this.props.toggleDrawer} underlayColor='#6441a4' />
                        <View style={{flex: 1, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <Text style={{color: '#ffffff'}}>{ viewTitle }</Text>
                            { ! this.props.hostAvailable ? ( <Icon name={'exclamation-triangle'} type={'font-awesome'} color={'#ff0000'} onPress={this.props.navToSettings} underlayColor={'#6441a4'} /> ) : null }
                        </View>
                    </View>
                </View>
                { view }
            </View>
        );
    }
}

AppViewContent = connect(
    state => {
        let view = state.getIn(['navState', 'view']);
        let hostAvailable = state.getIn(['navState', 'view']) === '_starting_up' || state.get('hostIpAddress');
        return { view, hostAvailable };
    },
    dispatch => {
        return {
            toggleDrawer: () => dispatch(actionToggleDrawer()),
            navToSettings: () => dispatch(actionSetNavView('settings')),
        };
    }
)(AppViewContent);

export { AppViewContent };
