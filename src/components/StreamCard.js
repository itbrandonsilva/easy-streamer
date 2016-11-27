import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Button, ButtonGroup } from 'react-native-elements';
import {
    Text,
    View,
    ScrollView,
} from 'react-native';

import { Network } from '../service/Network.js';
import { actionSetNavView, actionSetHostAddress } from '../state/actions.js';

class StreamCard extends Component {
    watchStream() {
        let quality = 3 - this.props.quality;
        Network.watchStream(this.props.host, this.props.stream.channel.name, quality, (err) => {
            if (err) {
                //this.props.setModalState({title: 'The host could not be reached.', text: 'Ensure the host device is setup properly and rediscover it from the app settings.', button: 'GO TO SETTINGS'});
                this.props.clearHostAddress();
                alert('Error: ' + err.message);
            }
        });
    }

    render() { 
        let stream = this.props.stream;
        return (
            <Card
                title={stream.channel.name + ' ( ' + stream.viewers + ' Viewers)'}
                //image={require('./github.png')}
                image={{uri: stream.preview.large}}
                imageStyle={{resizeMode: 'contain'}}>

                <Text style={{marginBottom: 10}}>
                    {stream.channel.status}
                </Text>

                <Button
                    icon={{name: 'play', type:'font-awesome'}}
                    backgroundColor='#6441A4'
                    fontFamily='Lato'
                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                    title='WATCH'
                    onPress={this.watchStream.bind(this)}/>
            </Card>
        );
    }
}

StreamCard = connect(
    state => {
        return {
            host: state.get('hostIpAddress'),
            quality: state.getIn(['settings', 'quality']),
        }
    },
    dispatch => {
        return {
            clearHostAddress: () => {
                dispatch(actionSetNavView('settings'));
                dispatch(actionSetHostAddress(null));
            },
        }
    }
)(StreamCard);

export { StreamCard };
