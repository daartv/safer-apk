import HomeScreen from './Home.js';
import FriendMap from './FriendMap.js';
import AddFence from './AddFence.js';
import GroupsList from './GroupsList.js';
import AllFriendsList from './AllFriendsList.js';
import Settings from './Settings.js';
import AddFriendList from './AddFriendList.js';
import CreateGroup from './CreateGroup.js';
import GroupMap from './GroupMap.js';
import LogOut from './LogOut.js';

import React from 'react';
import { Button } from 'react-native';
import { StackNavigator, TabNavigator, DrawerNavigator } from 'react-navigation';

const HomePageTabs = TabNavigator({
  Home: { screen: HomeScreen },
  GroupsList: { screen: GroupsList },
  AllFriendsList: { screen: AllFriendsList },
});

HomePageTabs.navigationOptions = ({navigation}) => ({
  title: 'Safely',
  headerLeft: <Button title='Menu' onPress={ () => navigation.navigate('DrawerOpen') } />,
  hederRight: <Button title='LogOut' onpress={ () => console.log('logout')} />
});

const Stack = StackNavigator({
  HomePageTabs: { screen: HomePageTabs },
  FriendMap: { screen: FriendMap },
  AddFence: { screen: AddFence },
  Settings: { screen: Settings },
  AddFriend: { screen: AddFriendList },
  CreateGroup: { screen: CreateGroup },
  GroupMap: { screen: GroupMap },
});

Stack.navigationOptions = {
  title: 'Home'
};

const MenuDrawer = DrawerNavigator({
  Stack: { screen: Stack },
  'Add Friend': { screen: AddFriendList },  
  Settings: { screen: Settings },
  'Log Out': { screen: LogOut },
  AddFriend: { screen: AddFriendList },  
  Settings: { screen: Settings },
  Fences: {screen: AddFence}
}, {
  drawerWidth: 200
});

export default MenuDrawer;

