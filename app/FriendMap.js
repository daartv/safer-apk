import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MapView from 'react-native-maps';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default class FriendMap extends Component {
  constructor(props) {
    super(props);
    this.state =  {};
    console.log('THIS.PROPS.NAVIGATION.STATE.PARAMS', this.props.navigation.state.params);
  }

  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.data.first
  });

  render() {
    const { data } = this.props.navigation.state.params;
    console.log(data);
    if(data.showSetting === 'GPS' && data.currentLabel === 'Elsewhere') {return this.renderElsewhere(data)}
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
    const { region } = this.props;
    console.log(region);
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={{
            latitude: data.lat,
            longitude: data.long,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          }}
        >
          <MapView.Marker 
            title={data.currentLabel}
            coordinate={{
             latitude: data.lat,
             longitude: data.long
            }}
          />
          <MapView.Circle
            center={{
              latitude: data.lat,
              longitude: data.long
            }}
            radius={300}
            fillColor={'#AED8CA', 'rgba(174,216,202,0.5)'}
          />
        </MapView>
      </View>
    );
  }

    renderElsewhere(data) {
    return (
      <View style={styles.container}>
        <MapView
         style={styles.map}
         region={{
          latitude: data.lat,
          longitude: data.long,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
          }}
        >
          <MapView.Marker 
           title={data.currentLabel}
           coordinate={{
             latitude: data.lat,
             longitude: data.long
            }}
          />
        </MapView>
      </View>
    );
  }
}