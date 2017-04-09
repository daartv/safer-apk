import HomePageNavigator from './Home.js';
import FriendMap from './FriendMap.js';
import AddFence from './AddFence.js'
import { StackNavigator } from 'react-navigation';

export default safely = StackNavigator({
  Home: { screen: HomePageNavigator },
  FriendMap: { screen: FriendMap },
  AddFence: { screen: AddFence }
});

