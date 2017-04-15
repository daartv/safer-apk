import React, { Component } from 'react';
import { AppState, View, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { endpoint, googleAuthWebClientId } from './endpoint.js';
import FriendMap from './FriendMap.js';
import {GoogleSignin, GoogleSigninButton} from 'react-native-google-signin';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      initialPosition: 'unknown',
      lastPosition: 'unknown'
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
      console.log('the new position is', position);
    });
  };

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    const { navigate } = this.props.navigation;
    if (!this.state.user) {
      return (
        <View style={styles.container}>
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
          <Button 
            onPress ={() => navigate('AddFence')}
            title="Geofence"
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

  async _setupGoogleSignin() {
    try {
      await GoogleSignin.hasPlayServices({ autoResolve: true });
      await GoogleSignin.configure({
        webClientId: googleAuthWebClientId, //replace with client_id from google-services.json
        offlineAccess: false
      });

      const user = await GoogleSignin.currentUserAsync();
      console.log(user);
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
    .catch((err) => {
      console.log('WRONG SIGNIN', err);
    })
    .done();
  }

  _signOut() {
    GoogleSignin.revokeAccess().then(() => GoogleSignin.signOut()).then(() => {
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


// This won't work without editing the server files to res.json('validated!');
    // fetch(endpoint + '/api/validate', {
    //   method: 'POST'
    // })
    //   .then(function(response) {
    //     return response.json();
    //   })
    //   .then(function(data) {
    //     console.log('data: ', data);
    //     this.setState({
    //       data: data
    //     });
    //   }.bind(this))
    //   .catch(function(error) {
    //     console.log('There was an error in fetching your data: ', error);
    //     return error;
    //   });
