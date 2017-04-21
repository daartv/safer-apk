import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
/*import { MapView } from 'react-native-maps';*/

export default class FriendMap extends Component {
  constructor(props) {
    super(props);
    this.state =  {};
    console.log(this.props.navigation.state.params);
  }

  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.data.first
  });

  render() {
    const { data } = this.props.navigation.state.params;
    console.log(data);
    if(data.showSetting === 'GPS') { return this.renderGPS(data); }
    if(data.showSetting === 'label') { return this.renderLabel(data); }
    if(data.showSetting === 'pending') { return this.renderPending(data); }
  }

  renderPending(data) {
    return (
      <View style={{marginTop: 10}}>
        <Text style={{textAlign: 'center', fontSize: 20}}>Friend request still pending...</Text>
      </View>
    );
  }

  renderLabel(data) {
    return (
      <View style={{marginTop: 10}}>
        <Text style={{textAlign: 'center', fontSize: 20}}>{data.first} checked in at:</Text> 
        <Text style={{textAlign: 'center', fontSize: 20}}>{data.currentLabel}</Text>
        <Text style={{textAlign: 'center', fontSize: 20}}>5 min ago</Text>
      </View>
    );
  }

  renderGPS(data) {
    return (
      <View style={{marginTop: 10}}>
        <Text style={{textAlign: 'center', fontSize: 20}}>Checked In At:</Text>
        <Image
          style={{justifyContent: 'center', height: 350, width: 350}}
          source={require('./Image/HackReactor2.png')}
        />
        <Text style={{textAlign: 'center', fontSize: 20}}>{data.currentLabel} 12 min Ago.</Text>
      </View>
    );
  }
}