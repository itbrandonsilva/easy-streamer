import React, { Component } from 'react';
import {
    Animated,
    Easing,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class AppViewContentLoading extends Component {
    constructor(props) {
        super(props);
        this.state = {
            angle: new Animated.Value(0),
        };
    }

    componentDidMount() {
        this.animate();
    }

    animate() {
        this.state.angle.setValue(0);
        Animated.timing(this.state.angle, {
            toValue: 360,
            duration: 1000,
            easing: Easing.linear,
        }).start(this.animate.bind(this));
    }

    render() {
        const AnimatedIcon = Animated.createAnimatedComponent(Icon);
        let angle = this.state.angle.interpolate({
            inputRange: [0, 360],
            outputRange: ['0deg', '360deg'],
        });

        let style = {transform: [{rotate: angle}]}

        return (
            <View 
                style={[
                    {paddingTop: 30, flexDirection: 'row', justifyContent: 'center'},
                ]}>
                <AnimatedIcon
                    ref={ref => this._spinner = ref}
                    style={style}
                    name={'spinner'}
                    size={this.props.size || 100}
                    color={'#6441A4'} />
            </View>
        )
    }
}

export { AppViewContentLoading };
