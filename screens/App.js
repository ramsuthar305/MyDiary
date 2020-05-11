import React, { useState, useEffect } from 'react';
import {
  View,
  Text,

} from 'react-native';
import * as firebase from 'firebase'
import firebaseConfig from './firebase.config'
export const AuthContext = React.createContext(null);
import { AsyncStorage } from "react-native";
firebase.initializeApp(firebaseConfig)
import { YellowBox } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import MainScreen from './MainScreen'
import Home from './Home'
console.disableYellowBox = true;

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setloading] = useState(true)
  _storeData = async (name, email, uid) => {
    try {
      await AsyncStorage.setItem('name', name);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('uid', uid);
      const value = await AsyncStorage.getItem('name');
      console.log("this is my value:" + value)
    } catch (error) {
      console.error(error)
    }
  }
  const db = firebase.firestore();

  function fetchData(uid) {


    //setDataLoading(true)
    //setallNotes([])
    let notesRef = db.collection('users');
    notesRef.where('uuid', '==', uid).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          _storeData(doc.data().name, doc.data().name, uid)
          //setallNotes(prevState => [...prevState, { id: doc.id, note: doc.data().note, title: doc.data().title, createdOn: doc.data().createdOn, due: doc.data().dueOn }])
        });
        //setDataLoading(false)

        //console.log(allNotes)
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }
  const getGlobalData = async () => {
    setglobalName(await AsyncStorage.getItem('name'));
    setglobalemail(await AsyncStorage.getItem('name'));
    setglobaluid(await AsyncStorage.getItem('name'));
  }
  useEffect(() => {
    getGlobalData()

  }, [])

  const [globalName, setglobalName] = useState(null)
  const [globalemail, setglobalemail] = useState(null)
  const [globaluid, setglobaluid] = useState(null)
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        fetchData(user.uid)
        return (
          setUser(user)


        )
      } else {
        // no user logged in. currentUser is null.
      }
    });
    setloading(false)
  }, [])

  console.log(user)



  if (user) {
    console.log('herer')
    return (

      <Home />
    )
  } else {
    console.log('there')
    return (

      loading ? null :
        <NavigationContainer>
          <MainScreen />
        </NavigationContainer>

    )
  }


}