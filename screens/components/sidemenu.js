import PropTypes from "prop-types";
import React, { Component, useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { NavigationActions } from "react-navigation";
import { DrawerActions } from "react-navigation-drawer";
import * as firebase from 'firebase'
import { AsyncStorage } from "react-native";
import { SimpleLineIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";


function SideMenu({ navigation }) {
  const retrieveUid = () => {
    AsyncStorage.setItem("uid",null).then(value => {
      if (value == null) {
        //If value is not set or your async storage is empty
      }
      else {
        console.log(value)
        setglobaluid(value)
        //fetchData(value)
      }
    }).catch(err => {
      // Add some error handling
    });
  }

  const retrieveName = () => {
    AsyncStorage.getItem("name").then(value => {
      if (value == null) {
        //If value is not set or your async storage is empty
      }
      else {
        console.log(value)
        setglobalName(value)

      }
    }).catch(err => {
      // Add some error handling
    });
  }

  const retrieveEmail = () => {
    AsyncStorage.getItem("email").then(value => {
      if (value == null) {
        //If value is not set or your async storage is empty
      }
      else {
        console.log(value)
        setglobalEmail(value)

      }
    }).catch(err => {
      // Add some error handling
    });
  }

  useEffect(() => {
    retrieveUid()
    signOutUser
    retrieveName()
    retrieveEmail()

  }, [])

  const signOutUser = async () => {
    try {
      await firebase.auth().signOut();
      navigation.navigate('App')
      await AsyncStorage.setItem('name', null);
      await AsyncStorage.setItem('email', null);
      await AsyncStorage.setItem('uid', null);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <View style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <View
        style={{
          paddingBottom: "8%",
          paddingTop: "10%",

        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 30,
            fontWeight: "bold",

            paddingBottom: "10%",
          }}
        >
          MyDiary
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(DrawerActions.toggleDrawer())
            navigation.navigate("Home")
          }
          }
        >
          <View style={{
            paddingBottom: "3%", paddingTop: "10%", borderTopWidth: 1,
            borderTopColor: "#bdc3c7"
          }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,

              }}
            >
              <SimpleLineIcons name="home" size={22} color="#34495e" /> Home
                </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(DrawerActions.toggleDrawer())
            navigation.navigate("Notes")
          }
          }
        >
          <View style={{
            paddingBottom: "3%", paddingTop: "10%"
          }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,

              }}
            >
              <SimpleLineIcons name="notebook" size={22} color="black" /> My Diary
                </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(DrawerActions.toggleDrawer())
            navigation.navigate("Tasks")
          }
          }
        >
          <View style={{
            paddingBottom: "3%", paddingTop: "10%"
          }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,

              }}
            >
              <FontAwesome5 name="tasks" size={22} color="black" /> My Tasks
                </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(DrawerActions.toggleDrawer())
            navigation.navigate("Holidays")
          }
          }
        >
          <View style={{
            paddingBottom: "3%", paddingTop: "10%"
          }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,

              }}
            >
              <Fontisto name="holiday-village" size={22} color="black" /> Holidays
                </Text>
          </View>
        </TouchableOpacity>


        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(DrawerActions.toggleDrawer())
            navigation.navigate("Timetable")
          }
          }
        >
          <View style={{
            paddingBottom: "3%", paddingTop: "10%"
          }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,

              }}
            >
              <MaterialCommunityIcons name="timetable" size={24} color="black" /> Time Table
                </Text>
          </View>
        </TouchableOpacity>


        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(DrawerActions.toggleDrawer())
            navigation.navigate("Feedback")
          }
          }
        >
          <View style={{
            paddingBottom: "3%", paddingTop: "10%",
          }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,

              }}
            >
              <MaterialIcons name="feedback" size={24} color="black" /> Feedback
                </Text>
          </View>
        </TouchableOpacity>



        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(DrawerActions.toggleDrawer())
            navigation.navigate("About")
          }
          }
        >
          <View style={{
            paddingBottom: "3%", paddingTop: "10%",
          }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,

              }}
            >
              <SimpleLineIcons name="info" size={24} color="black" /> About us
                </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={signOutUser}
        >
          <View style={{
            paddingBottom: "3%", paddingTop: "10%"
          }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,

              }}
            >
              <SimpleLineIcons name="logout" size={22} color="black" /> Log out
                </Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity

        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())
        }
      >
        <View style={{ paddingBottom: "8%", paddingTop: "8%", backgroundColor: "#fcba02", }}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,

              color: 'white'
            }}
          >
            Open source initiative
                </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}


SideMenu.propTypes = {
  navigation: PropTypes.object
};

export default SideMenu;
