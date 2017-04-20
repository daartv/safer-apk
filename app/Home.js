import React, { Component } from 'react';
import FriendMap from './FriendMap.js';
import HomeFavorite from './HomeFavorite.js';
import { AppState, View, Button, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { endpoint, googleAuthWebClientId } from './endpoint.js';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import PushController from './FCM/PushController.js';
<<<<<<< HEAD
import GeoFencing from 'react-native-geo-fencing';
import AuthAxios from './AuthAxios.js';
import axios from 'axios';
=======
import { distanceBetweenCoordinates, degreesToRadians } from './geoFencingUtils/geoFencingUtils.js'
>>>>>>> finds if the user is in a fence and stores the label and location to the database

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      phoneNumber: '',
      currentlyAt: ''
    };
  };

  static navigationOptions = {
    title: 'Favorites'
  };
  
  watchID: ?number = null;

  geoMonitoring() {
    //Getting coordinates and setting to the state
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});

      let point = {
        lat: position.coords.latitude, //position.coords.latitude
        lng: position.coords.longitude, //position.coords.longitude
      };
      this.checkFences(point);
    });
  }

  checkFences(currentPoint) {
    let phoneNumber = '1234567'
    // fetch(`${endpoint}/api/labels/?id=${phoneNumber}`, {
    //   method: 'GET',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   }
    // })
    return AuthAxios({
      url: `/api/labels/?id=${phoneNumber}`
    })
    .then(function (response) {
      return response.json()
    })
    .then((fences) => {
      for (var fence of fences) {
        let proximity = distanceBetweenCoordinates(currentPoint.lat, currentPoint.lng, fence.lat, fence.lng);
        let radius = 0.5;
        let location = {};
        if (proximity < radius) {
          this.setState({currentlyAt: fence.label}, () => this.saveLocation());
          break;  
        } else {
          this.setState({currentlyAt: 'Elsewhere'}, () => this.saveLocation());
        }
      }
    })
    .catch(function (error) {
      console.log('error retrieving current fences', error)
    })
  }

  saveLocation () {
    let location = {};
    let position = JSON.parse(this.state.lastPosition);
    location.lat = position.coords.latitude;
    location.lng = position.coords.longitude;
    location.label = this.state.currentlyAt;
    location.user = '1234567'

    fetch(`${endpoint}/api/users/location`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(location)
    })
    .then((response) => console.log('the location object sent', location))
    .catch((error) => console.log('oh oh'))
  }

  componentDidMount() {
    this._setupGoogleSignin();

    this.geoMonitoring();
  };

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    const { navigate } = this.props.navigation;
    if (!this.state.user && this.state.phoneNumber.length < 10) {
      return (
        <View>
          <Text style={{fontSize: 25}}>
            Please enter your phone number
          </Text>
          <TextInput
            style={{fontSize: 25}}
            onChangeText={(text) => this.setState( {phoneNumber: text} )}
            // placeholder='Insert Group Name'
            value={this.state.text}
          />
        </View>
      )
    }
    if (!this.state.user && this.state.phoneNumber.length === 10) {
      return (
          <View style={styles.container}>
            <Text>Your phone number: {this.state.phoneNumber}</Text>
            <GoogleSigninButton
              style={{width: 312, height: 48}}
              color={GoogleSigninButton.Color.Dark}
              size={GoogleSigninButton.Size.Wide}
              onPress={() => { this._signIn(); }}
            />
          </View>
      );
    }
    if (this.state.user) {
      return (
        <View>
          <PushController onChangeToken={(token) => {this.setState({FCMToken: token})}}/>
          <HomeFavorite />
          <TouchableOpacity onPress={() => {this._signOut()} }>
            <Text>Log Out</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }


  async _setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        webClientId: googleAuthWebClientId, //replace with client_id from google-services.json
        offlineAccess: false
      });

      const user = await GoogleSignin.currentUserAsync();
      this.setState({user});
    }
    catch(err) {
      console.log("Play services error", err.code, err.message);
    }
  }

  _signIn() {
    GoogleSignin.signIn()
    .then((user) => {
      this.setState({user: user});
    })
    .then(() => {
      return AuthAxios({
        url: '/api/user/',
        method: 'put',
        data: {phoneNumber: this.state.phoneNumber}
      })
    })
    .catch((err) => {
      console.error('Sign in error: ', err);
    })
    .done();
  }

  _signOut() {
    GoogleSignin.revokeAccess()
    .then(() => {
      GoogleSignin.signOut();
      console.log('Google access revoked');
    })
    .then(() => {
      this.setState({user: null});
    })
    .done();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
