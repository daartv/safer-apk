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

  makeSquare (center) {
    let squareFence = [
    {lat: 0, lng: 0}, 
    {lat: 0, lng: 0}, 
    {lat: 0, lng: 0}, 
    {lat: 0, lng: 0},
    {lat: 0, lng: 0} 
  ]

    squareFence[0].lat = center.lat + 50 * 90/10000000
    squareFence[0].lng = center.lng + 50/2 * 90/10000000 / Math.cos(center.lat)
    squareFence[1].lat = center.lat + 50/2 * 90/10000000
    squareFence[1].lng = center.lng - 50/2 * 90/10000000 / Math.cos(center.lat)
    squareFence[2].lat = center.lat - 50/2 * 90/10000000
    squareFence[2].lng = center.lng + 50/2 * 90/10000000 / Math.cos(center.lat)
    squareFence[3].lat = center.lat - 50/2 * 90/10000000
    squareFence[3].lng = center.lng - 50/2 * 90/10000000 / Math.cos(center.lat)
    squareFence[4].lat = center.lat + 50 * 90/10000000
    squareFence[4].lng = center.lng + 50/2 * 90/10000000 / Math.cos(center.lat)


  console.log(squareFence);

  navigator.geolocation.getCurrentPosition(
    (position) => {
      let point = {
        lat: position.coords.latitude,
        lng: postion.coords.longitude
      };
      GeoFencing.containsLocation(point, squareFence)
        .then(() => console.log('inside the fence'))
        .catch(() => console.log('point is NOT within fence'))
    },
    (error) => alert(error.message),
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
  )}


  render() {
    return (
      <View>
        <Picker 
          selectedValue={this.state.label}
          onValueChange={this.onValueChange.bind(this)}>
          <Item label='Home' value='Home' />
          <Item label= 'Work' value='Work' />
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
              onPress={() => this.makeSquare(this.state.coordinates)}
          />
        </View>
      </View>
    );
  }
}

