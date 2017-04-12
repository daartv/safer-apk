import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Picker } from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import GeoFencing from 'react-native-geo-fencing'


const Item = Picker.Item
export default class AddFence extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: 'Home'
    }
  }

  static navigationOptions = {
    title: 'Add a Geofence',
  };

  onValueChange (label) {
    const newState = {};
    newState.label = label;
    this.setState(newState)
  }

  makeFence (center) {
    let fence = [
    {lat: 0, lng: 0}, 
    {lat: 0, lng: 0}, 
    {lat: 0, lng: 0}, 
    {lat: 0, lng: 0},
    {lat: 0, lng: 0} 
  ]

    fence[0].lat = center.lat + 50 * 90/10000000
    fence[0].lng = center.lng + 50/2 * 90/10000000 / Math.cos(center.lat)
    fence[1].lat = center.lat + 50/2 * 90/10000000
    fence[1].lng = center.lng - 50/2 * 90/10000000 / Math.cos(center.lat)
    fence[2].lat = center.lat - 50/2 * 90/10000000
    fence[2].lng = center.lng + 50/2 * 90/10000000 / Math.cos(center.lat)
    fence[3].lat = center.lat - 50/2 * 90/10000000
    fence[3].lng = center.lng - 50/2 * 90/10000000 / Math.cos(center.lat)
    fence[4].lat = center.lat + 50 * 90/10000000
    fence[4].lng = center.lng + 50/2 * 90/10000000 / Math.cos(center.lat)


  fence.label = this.state.label;
  console.log(fence);
/*  navigator.geolocation.getCurrentPosition(
    (position) => {
      let point = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      GeoFencing.containsLocation(point, squareFence)
        .then(() => alert('you are inside the fence'))
        .catch(() => alert('Not inside the fence'))
    },
    (error) => alert(error.message),
    {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
  )*/}


  render() {
    return (
      <View>
        <Picker 
          selectedValue={this.state.label}
          onValueChange={this.onValueChange.bind(this)}>
          <Item label='Home' value='Home' />
          <Item label= 'Work' value='Work' />
          <Item label= 'School' value='School' />
          <Item label= 'Gym' value='Gym' />
          <Item label= 'Bar' value='Bar' />   
        </Picker>
        <View style={{flexDirection: 'row'}}>
          <GooglePlacesAutocomplete
            placeholder='Input an address'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            listViewDisplayed='true'    // true/false/undefined
            fetchDetails={true}
            renderDescription={(row) => row.description} // custom description render
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
              console.log(details.geometry.location)
              this.setState({coordinates: details.geometry.location}, function () {
                console.log('This is the state', this.state.coordinates);
              })
            }}
            getDefaultValue={() => {
              return ''; // text input default value
            }}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: 'AIzaSyDEG1bzKYZIfvieQnrM-SCR0wOy5N5fHG0',
              language: 'en' // language of the results
            }}
            styles={{
              position: 'fixed',
              display: 'block',
              listView: {
                position: 'absolute'
              }
            }}

             // Will add a 'Current location' button at the top of the predefined places list
            
            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }}
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: 'distance'
            }}

            debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        />
          <Button
              title='Set this fence'
              onPress={() => this.makeFence(this.state.coordinates)}
          />
        </View>
      </View>
    );
  }
}

