import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import {
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

        return (
            <View style={{flex: 1, backgroundColor: '#ededed', paddingTop: 50, borderRightWidth: 1, borderRightWidth: 1, borderRightColor: '#d1d1d1'}}>
                <List containerStyle={{paddingTop: 0, marginTop: 0, marginBottom: 20}}>
                    { menuItems }
                </List>
            </View>
        );
    }
}

MenuComponent = connect(
    null,
    dispatch => {
        return {
            navigate: (view) => dispatch(actionSetNavView(view)),
        }
    }
)(MenuComponent);

export { MenuComponent };
