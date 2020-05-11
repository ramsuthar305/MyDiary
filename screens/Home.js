import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Modal,
  Alert,
  TouchableOpacity,
  Dimensions,
  Button,
  TextInput, Vibration, Platform

} from "react-native";
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as Font from "expo-font";
import { AppLoading } from "expo";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import Columns from "./components/CoronaStatusColumn";
import MenuButton from './components/MenuColumn'
import LottieView from 'lottie-react-native';
import Header from './components/Header';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from "react-navigation-stack";
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import Holidays from './holiday'
import SideMenu from './components/sidemenu'
import DateTimePicker from '@react-native-community/datetimepicker';
import About from './about'
import { permission, notification } from 'expo'
import * as firebase from 'firebase'
import AuthContext from './App'
import firestore from 'firebase/firestore'
import NoteList from './list'
import ReadNote from './ReadNote'
import Feedback from './feedback'
import Timetable from './timetable'
import Tasks from './tasks'
import ReadTask from './ReadTask'
import App from './App'
import { AsyncStorage } from "react-native";


const { height, width } = Dimensions.get("screen");
const fetchFonts = () => {
  console.log("loading font");
  return Font.loadAsync({
    "Nunito-regular": require("../assets/fonts/Nunito-Regular.ttf"),
    "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
    "Nunito-SemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
  });
};


export function Home({ navigation, uid }) {
  // const [expoPushToken, setexpoPushToken] = useState(null)
  // const [notification, setnotification] = useState({})

  // const registerForPushNotificationsAsync = async () => {
  //   if (Constants.isDevice) {
  //     const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  //     let finalStatus = existingStatus;
  //     if (existingStatus !== 'granted') {
  //       const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  //       finalStatus = status;
  //     }
  //     if (finalStatus !== 'granted') {
  //       alert('Failed to get push token for push notification!');
  //       return;
  //     }
  //     token = await Notifications.getExpoPushTokenAsync();
  //     console.log(token);
  //     setexpoPushToken(token);
  //   } else {
  //     alert('Must use physical device for Push Notifications');
  //   }

  //   if (Platform.OS === 'android') {
  //     Notifications.createChannelAndroidAsync('default', {
  //       name: 'default',
  //       sound: true,
  //       priority: 'max',
  //       vibrate: [0, 250, 250, 250],
  //     });
  //   }
  // };

  // useEffect(() => {
  //   registerForPushNotificationsAsync()
  // })



  const [globalName, setglobalName] = useState(null)
  const [globalemail, setglobalemail] = useState(null)
  const [globaluid, setglobaluid] = useState(null)
  console.log('piche se ai hui uid: ' + globaluid)

  const db = firebase.firestore();
  function fetchData(value) {
    setDataLoading(true)
    //setallNotes([])
    let notesRef = db.collection('tasks');
    notesRef.where('uuid', '==', value).OrderBy("dueOn", firestore.Asc).limit(1)
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());

          //setallNotes(prevState => [...prevState, { id: doc.id, note: doc.data().note, title: doc.data().title, createdOn: doc.data().createdOn, due: doc.data().dueOn }])
        });
        setDataLoading(false)

        //console.log(allNotes)
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

  const retrieveUid = () => {
    AsyncStorage.getItem("uid").then(value => {
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
    retrieveName()
    retrieveEmail()

  }, [])


  const [dataLoaded, setDataLoaded] = useState(false);
  const [Note, setNote] = useState([]);
  const [DataLoading, setDataLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const openDraw = () => {
    navigation.openDrawer();
  }
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('datetime');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const addNote = async () => {
    try {
      const db = firebase.firestore();
      db.collection('notes').add({
        name: globalName,
        note: Note,
        date: new Date(),
        uid: "55omyoPTyLcV2E3keDePKNQVVLs1"
      }).then(ref => {
        console.log('Added document with ID: ', ref.id);
        setModalVisible(!modalVisible)
      });
    } catch (e) {
      console.error(e)
    }

  }
  const registerForPushNotification = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      this.setState({ expoPushToken: token });
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  }
  const openNotes = () => { console.log('tapped'); navigation.navigate('Notes') }
  const openHolidays = () => { console.log('tapped'); navigation.navigate('Holidays') }



  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
      />
    );
  }
  if (DataLoading) {
    return (<LottieView
      autoPlay loop
      source={require('../assets/images/coronaLoading.json')}
    />);
  } else {
    return (

      <SafeAreaView style={style.safeArea}>
        <StatusBar translucent color="black" backgroundColor="black" />
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{ marginTop: 22, flex: 1, justifyContent: "center", alignContent: 'center', padding: "5%", alignItems: 'center' }}>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
            <TextInput
              style={style.noteInput}
              placeholder="Your note here"
              onChangeText={text => setNote(text)}
              defaultValue={''}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity
                style={style.button}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text style={style.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={style.button}
                onPress={addNote}>
                <Text style={style.buttonText}>Date</Text>
              </TouchableOpacity>


            </View>

          </View>
        </Modal>
        <TouchableOpacity onPress={openDraw} style={{ marginTop: "2%" }}>
          <Header />
        </TouchableOpacity>

        <View style={{ marginTop: "6%", flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignContent: "center", alignItems: "center", justifyContent: "center" }}>
          <MenuButton title={"My Diary"} image={require('../assets/images/diary.png')} onPress={openNotes} />
          <MenuButton title={"My Tasks"} image={require('../assets/images/pending.png')} onPress={() => navigation.navigate("Tasks", { GUid: globaluid })} />
          <MenuButton title={"Holidays"} image={require('../assets/images/summertime.png')} onPress={openHolidays} />
          <MenuButton title={"Time table"} image={require('../assets/images/table.png')} onPress={() => navigation.navigate("Timetable")} />
          <MenuButton title={"Feedback"} image={require('../assets/images/communication.png')} onPress={() => navigation.navigate("Feedback")} />
          <MenuButton title={"About us"} image={require('../assets/images/sign.png')} onPress={() => navigation.navigate("About")} />

        </View>
      </SafeAreaView>

    );
  }

}

const StackNavigator = createStackNavigator(
  {
    Home: Home,
    Notes: NoteList,
    ReadNote: ReadNote,
    Holidays: Holidays,
    Feedback: Feedback,
    Tasks: Tasks,
    Timetable: Timetable,
    ReadTask: ReadTask,
    App: App,
    About: About
  },
  {
    initialRouteName: "Home",
    contentComponent: SideMenu,

    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
);

const DrawerNavigation = createDrawerNavigator(
  {
    StackNavigator: {
      screen: StackNavigator
    }
  },
  {
    contentComponent: SideMenu,
  },
);

const ApplicationContainer = createAppContainer(DrawerNavigation);

export default () => {
  const [blue, setBlue] = useState(true);
  return (

    <ApplicationContainer />

  );
};

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const iconHeight = height * 0.10;
const style = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? STATUSBAR_HEIGHT + 30 : StatusBar.currentHeight,
    paddingHorizontal: "3%",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  menu: {
    height: 25,
    width: 22,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 20,
    color: "#636e72",
  },
  healthStatus: {
    backgroundColor: "#EA2027",
    borderRadius: 15,
    padding: "5%",
  },

  healthStatusHeading: {
    color: "white",
    fontFamily: "Nunito-Bold",
    fontSize: 18,
  },
  healthStatusTagline: {
    color: "white",
    fontFamily: "Nunito-Bold",
    fontSize: 14,
    marginTop: "3%",
  },
  GlobalStatusHeading: {
    color: "black",
    fontFamily: "Nunito-Bold",
    fontSize: 20,
  },
  lastUpdated: {
    fontFamily: "Nunito-regular",
  },
  newsHeadline: {
    fontSize: 16.5,
    fontFamily: "Nunito-regular",
    flex: 8,
  },
  menuHeading: {
    flex: 1,
    marginTop: "8%",
    fontFamily: "Nunito-SemiBold",
    fontSize: height / 40,
    color: "#1e3799"
  },
  menuIcon: {
    width: '65%',
    height: undefined,
    flex: 0.6,
    aspectRatio: 1,
  },
  noteInput: {
    height: height / 5,
    width: "90%",
    textAlign: "center",
    fontFamily: "Nunito-SemiBold",
    fontSize: 18,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10
  },
  button: {
    width: width / 3,
    backgroundColor: "#0984e3",
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: "5%",
    alignContent: "center",
    marginTop: "3%",
    padding: "3%"

  },
  buttonText: {
    color: "white",
    fontFamily: "Nunito-SemiBold",
    fontSize: 18,

  }

});
