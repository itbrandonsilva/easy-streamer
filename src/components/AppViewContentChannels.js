import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Button, ButtonGroup } from 'react-native-elements';
import {
    Text,
    View,
    ScrollView,
} from 'react-native';

import { StreamCard } from './index.js';

class AppViewContentChannels extends Component {
    render() { 
        let streams = this.props.streams.map(stream => {
            return (<StreamCard stream={stream} key={stream.channel.name} />);
        });

        return (
            <ScrollView style={{backgroundColor: '#ededed'}}>
                { streams }
            </ScrollView>
        )
    }
}

AppViewContentChannels = connect(
    state => {
        let streams = [];
        if (state.getIn(['navState', 'view']) === 'top_streams') {
            streams = state.getIn(['navState', 'streams']).toJS();
        }
        return { streams };
    }
)(AppViewContentChannels);

export { AppViewContentChannels };
