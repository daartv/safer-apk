import React, { Component } from 'react';
import { AppState, View, Button, Text, StyleSheet } from 'react-native';

// import endpoint from './endpoint.js';
import FriendMap from './FriendMap.js';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  };

  static navigationOptions = {
    title: 'Favorites'
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
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
      </View>
    );
  };
};

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
