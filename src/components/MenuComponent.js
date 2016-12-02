import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, List, ListItem } from 'react-native-elements';
import {
    Text,
    View,
} from 'react-native';

import { actionSetNavView } from '../state/actions.js';

class MenuComponent extends Component {
    constructor(props) {
        super(props);

        this.menuItems = [
            {
                name: 'Games',
                icon: 'gamepad',
                type: 'font-awesome',
                view: 'top_games',
            },
            {
                name: 'Top Streams',
                icon: 'television',
                type: 'font-awesome',
                view: 'top_streams',
            },
            {
                name: 'Settings',
                icon: 'wrench',
                type: 'font-awesome',
                view: 'settings',
            },
        ];
    }

    render() {
        let menuItems = this.menuItems.map((menuItem, idx) => {
            return (
                <ListItem
                    //roundAvatar
                    //avatar={{uri:item.avatar_url}}
                    leftIcon={{name: menuItem.icon, type: menuItem.type, color: '#000000'}}
                    hideChevron={true}
                    onPress={() => this.props.navigate(menuItem.view)}
                    key={idx}
                    //subtitle={item.subtitle}
                    title={menuItem.name} />
            );
        });

        let status;
        let style = {height: 50, paddingLeft: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ededed'};
        if (this.props.hostAvailable)
            status = (
                <View style={style}>
                    <Icon name={'check'} type={'font-awesome'} color={'#00ff00'} onPress={this.props.navToSettings} underlayColor={'#6441a4'} />
                    <Text style={{marginLeft: 10}}>Ready</Text>
                </View>
            );
        else
            status = (
                <View style={style}>
                    <Icon name={'exclamation-triangle'} type={'font-awesome'} color={'#ff0000'} onPress={this.props.navToSettings} underlayColor={'#6441a4'} />
                    <Text style={{marginLeft: 10}}>Not Ready</Text>
                </View>
            );

        return (
            <View style={{flex: 1}}>
                { status }
                <View style={{flex: 1, backgroundColor: '#ededed', borderRightWidth: 1, borderRightWidth: 1, borderRightColor: '#d1d1d1'}}>
                    <List containerStyle={{paddingTop: 0, marginTop: 0, marginBottom: 20}}>
                        { menuItems }
                    </List>
                </View>
            </View>
        );
    }
}

MenuComponent = connect(
    state => {
        return {
            hostAvailable: state.getIn(['navState', 'view']) === '_starting_up' || state.get('hostIpAddress'),
        }
    },
    dispatch => {
        return {
            navigate: (view) => dispatch(actionSetNavView(view)),
        }
    }
)(MenuComponent);

export { MenuComponent };
