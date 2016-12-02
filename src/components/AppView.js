import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    BackAndroid,
    View,
    Dimensions,
    Linking,
} from 'react-native';
import Drawer from 'react-native-drawer';

import { styles } from '../styles.js';
import { AppViewContent } from './index.js';
import { actionDiscoverHost, actionSetHostAddress, actionSetNavView, actionOpenDrawer, actionCloseDrawer } from '../state/actions.js';
import { MenuComponent } from './index.js';

import { Network } from '../service/Network.js';

const drawerStyles = {
    drawer: {
        //top: Navigator.NavigationBar.Styles.General.NavBarHeight,
        shadowColor: '#000000',
        shadowOpacity: 0.8,
        shadowRadius: 3,
        backgroundColor: 'teal',
    },
    main: {
    }
};

class AppView extends Component {
    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', () => {
            if (this.props.view === 'top_streams') {
                this.props.setView('top_games');
                return true;
            }
        });

        if (this.props.view === '_starting_up') {
            this.props.discoverHost();

            const url = Linking.getInitialURL().then(url => {
                //API.getStreams().then(
                //    response => { 
                //        //alert(JSON.stringify(response.streams, null, 2))
                //        this.setState({ channels: response.streams });
                //    }
                //);

                //if (url) {
                //    let token = url.split('access_token=')[1].split('&scope=')[0];
                //    return API.setToken(token);
                //} 

                //API.auth();
            }); 
        }
    }

    /*componentDidMount() {
        Network.discover().then(ipAddress => {
            if (ipAddress) {
                this.props.assignHostAddress(ipAddress);
                this.props.setView('top_streams');
            } else {
                this.props.setView('settings');
            }
            // else => pop up modal to inform the user
        });
    }*/

    render() { 
        let { width } = Dimensions.get('window');
        let menuContent = ( <MenuComponent /> );
        return (
            <View style={styles.container}>
                <Drawer
                    open={this.props.isOpen}
                    styles={drawerStyles}
                    type={"displace"}
                    content={menuContent}
                    openDrawerOffset={0.65}
                    closedDrawerOffset={0}
                    side={'left'}
                    tweenDuration={250}
                    tweenEasing={'easeOutQuint'}
                    captureGestures={false}
                    onOpen={this.props.open}
                    onClose={this.props.close}
                    tapToClose={true}
                    panCloseMask={0.65}
                    panOpenMask={0.8}
                    >
                        <AppViewContent />
                </Drawer>
            </View>
        );
    }
}

AppView = connect(
    state => {
        return {isOpen: state.get('drawerOpen'), view: state.getIn(['navState', 'view'])};
    },
    dispatch => {
        return {
            open: () => dispatch(actionOpenDrawer()),
            close: () => dispatch(actionCloseDrawer()),
            setView: (view) => dispatch(actionSetNavView(view)),
            discoverHost: () => dispatch(actionDiscoverHost()),
        }
    }
)(AppView);

export { AppView };
