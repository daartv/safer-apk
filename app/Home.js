import React, { Component } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { TabNavigator } from 'react-navigation';

import GroupsList from './GroupsList.js';
import AllFriendsList from './AllFriendsList.js';
import FriendMap from './FriendMap.js';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static navigationOptions = {
    title: 'Favorites'
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text>Yo Yo refactor</Text>
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
    )
  }
}

export default HomePageNavigator = TabNavigator({
  Home: { screen: HomeScreen },
  GroupsList: { screen: GroupsList },
  AllFriendsList: { screen: AllFriendsList },
})

HomePageNavigator.navigationOptions = {
  title: 'Safer'
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});