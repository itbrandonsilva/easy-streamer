import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Button, ButtonGroup, List, ListItem } from 'react-native-elements';
import {
    Text,
    View,
    ScrollView,
} from 'react-native';

import { StreamCard } from './index.js';
import { actionSetNavView } from '../state/actions.js';

class AppViewContentGames extends Component {
    render() { 
        let games = this.props.games.map(game => {
            return (
                <ListItem
                    key={game.game.name}
                    avatar={{uri: game.game.box.small}}
                    title={game.game.name}
                    subtitle={game.viewers + ' viewers.'}
                    onPress={() => { this.props.navToStreams(game.game.name) }} />
            );
        });

        return (
            <ScrollView style={{backgroundColor: '#ededed'}}>
                <List containerStyle={{marginTop: 0}}>
                    { games }
                </List>
                {/* { streams } */}
            </ScrollView>
        )
    }
}

AppViewContentGames = connect(
    state => {
        let games = [];
        if (state.getIn(['navState', 'view']) === 'top_games') {
            games = state.getIn(['navState', 'games']).toJS();
        }
        return { games };
    },
    dispatch => {
        return {
            navToStreams: (game) => { dispatch(actionSetNavView('top_streams', {game})); },
        }
    }
)(AppViewContentGames);

export { AppViewContentGames };
