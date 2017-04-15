import React, { Component } from 'react';
import FriendMap from './FriendMap.js';
import HomeFavorite from './HomeFavorite.js';
import { AppState, View, Button, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { endpoint, googleAuthWebClientId } from './endpoint.js';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';
import PushController from './FCM/PushController.js';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      phoneNumber: ''
    };
  };

  static navigationOptions = {
    title: 'Favorites'
  };

  componentDidMount() {
    this._setupGoogleSignin();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition}, () => console.log(this.state));
        console.log('Initial position', position)
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});

      let phoneNumber = '1234567' //Hard coded phone number to make it update coordinates
      let userCoordinates = {};
      userCoordinates.lat = position.coords.latitude.toString();
      userCoordinates.lng = position.coords.longitude.toString();
      console.log('the new position is', position);
      fetch(`${endpoint}/api/users/location/?id=${phoneNumber}`, {
        method: 'PUT',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(userCoordinates)
      })
        .then(function (response) {
          console.log('Location updated!')
        })
        .catch(function (error) {
          console.log('Problem sending updated location to the server')
        })
    });
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
          <HomeFavorite />
        <View style={styles.container}>
          <Text>Hello {this.state.user.name}</Text>
          <Text>Notifications???</Text>
          <Button
            onPress={() => navigate('FriendMap', { 
                friendId: 1234567890,
                friendName: 'Kyle' 
              })
            }
            title="See yo friend yo"
          />
          <TouchableOpacity onPress={() => {this._signOut(); }}>
            <View style={{marginTop: 50}}>
              <Text>Log out</Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
  }
        // <View style={styles.container}>
        //   <Text>Hello {this.state.user.name}</Text>
        //   <Text>Notifications???</Text>
        //   <Button
        //     onPress={() => navigate('FriendMap', { 
        //         friendId: 1234567890,
        //         friendName: 'Kyle' 
        //       })
        //     }
        //     title="See yo friend yo"
        //   />
        //   <Button 
        //     onPress ={() => navigate('AddFence')}
        //     title="Geofence"
        //   />
        //   <TouchableOpacity onPress={() => {this._signOut(); }}>
        //     <View style={{marginTop: 50}}>
        //       <Text>Log out</Text>
        //     </View>
        //   </TouchableOpacity>
        // </View>

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
      console.log(user);
      this.setState({user: user});
    })
    .then(() => {
      return fetch(`${endpoint}/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.state.user.idToken}`
      },
      body: JSON.stringify({phoneNumber: this.state.phoneNumber})
      })
    })
    .catch((err) => {
      console.log('WRONG SIGNIN', err);
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
