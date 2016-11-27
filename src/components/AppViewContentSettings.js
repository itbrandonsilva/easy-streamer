import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, List, ListItem, Card, Icon } from 'react-native-elements';
import {
    Text,
    View,
    ScrollView,
} from 'react-native';

import { actionDiscoverHost, actionSetSettingsQuality } from '../state/actions.js';

const QUALITY_BUTTONS = ['Low', 'Medium', 'High', 'Best'];

class AppViewContentSettings extends Component {
    render() { 
        let address = this.props.hostIpAddress;
        let settings =  [
            {
                icon: {
                    name: 'wifi',
                    color: '#000000',
                    type: 'font-awesome',
                },
                component: () => { return (
                    <View style={{padding: 10, borderBottomColor: '#ededed', backgroundColor: 'white'}}>
                    <View style={{flexDirection: 'row'}}>
                        <Icon
                          type={'font-awesome'}
                          iconStyle={{marginRight: 8}}
                          name={'video-camera'}
                          color={'#000000'} />
                        <View style={{flex: 1, alignItems: 'flex-start'}}>
                            <Text style={{color: '#000000'}}>Stream Quality</Text>
                            <ButtonGroup
                                onPress={this.props.setQuality}
                                selectedIndex={this.props.quality}
                                selectedBackgroundColor={'#6441A4'}
                                selectedTextStyle={{color: '#ffffff'}}
                                containerStyle={{paddingLeft: 0, marginLeft: 0}}
                                buttons={QUALITY_BUTTONS} />
                        </View> 
                    </View>
                    </View>
                )},
            },
        ];


        if (address) {
            settings.push({
                name: 'Host IP Address:',
                icon: {
                    name: 'wifi',
                    color: '#000000',
                    type: 'font-awesome',
                },
                subtitle: this.props.hostIpAddress,
                style: {borderBottomWidth: 0},
                hideChevron: true,
            });
        } else {
            settings.unshift({
                component: () => { return (
                    <View>
                        <Text>
                            {'We were unable to locate your host device. Ensure both your client and host devices are both connected to the same subnet before attempting to discover your host device.'}
                        </Text>
                        <Button
                            raised
                            buttonStyle={{marginTop: 10}}
                            backgroundColor={'#6441A4'}
                            title='DISCOVER HOST'
                            onPress={this.props.discoverHost} /> 
                    </View>
                )},
            });
        }


        let cards = settings.map((item, idx) => {
            return (
                <Card key={idx}>
                    <ListItem
                        component={item.component}
                        leftIcon={item.icon}
                        title={item.name}
                        subtitle={item.subtitle}
                        containerStyle={item.style}
                        hideChevron={item.hideChevron}
                    />
                </Card>
            );
        });

        return (
            <ScrollView style={{backgroundColor: '#ededed'}}>
                { cards }
            </ScrollView>
        );
    }
}

AppViewContentSettings = connect(
    state => {
        let hostIpAddress = state.get('hostIpAddress');
        let quality = state.getIn(['settings', 'quality']);
        return { hostIpAddress, quality };
    },
    dispatch => {
        return {
            setQuality: (quality) => dispatch(actionSetSettingsQuality(quality)),
            discoverHost: () => dispatch(actionDiscoverHost()),
        };
    }
)(AppViewContentSettings);

export { AppViewContentSettings };
