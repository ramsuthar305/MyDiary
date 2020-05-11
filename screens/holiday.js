import React, { useState, useEffect, SyntheticEvent } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,

} from "react-native";
import * as Font from "expo-font";
import Moment from 'moment';
import { AppLoading } from "expo";
import Header from './components/Header'
import Holiday from './components/holiday'
import * as Calendar from 'expo-calendar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
Moment.locale('en');
const { height, width } = Dimensions.get("screen");
const fetchFonts = () => {
    console.log("loading font");
    return Font.loadAsync({
        "Nunito-regular": require("../assets/fonts/Nunito-Regular.ttf"),
        "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
        "Nunito-SemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
    });
};


export default function Holidays({ navigation }) {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [holidaysList, setholidaysList] = useState([]);
    const [DataLoading, setDataLoading] = useState(true);


    // useEffect(() => {
    //     (async () => {
    //         const { status } = await Calendar.requestCalendarPermissionsAsync();
    //         if (status === 'granted') {
    //             const calendars = await Calendar.getCalendarsAsync();
    //             console.log('Here are all your calendars:');
    //             console.log({ calendars });
    //             const calendar = calendars.find(({ isPrimary }) => isPrimary);
    //             console.log(calendar)
    //             //const events = await Calendar.getEventsAsync(["1","2","3","4","5"], "2018-05-16T20:00:00.000Z", "2020-04-16T20:00:00.000Z")
    //             const events = await Calendar.openEventInCalendar("1")
    //             console.log("all your events: ", events)
    //         }
    //     }
    //     )();

    // }, []);
    async function fetchData() {
        let response = await fetch("https://holidayapi.com/v1/holidays?pretty&key=8df1e8e2-87fa-4e5b-8a1b-fe988526f830&country=IN&year=2019");
        let list = await response.json()
        setholidaysList(list.holidays);
    }

    useEffect(() => {
        fetchData();
        console.log(holidaysList)



    }, [])

    useEffect(() => {
        if (holidaysList.length != 0) {
            setDataLoading(false)
        }
    }, [holidaysList])

    const openDraw = () => {
        navigation.openDrawer();
    }
    if (!dataLoaded) {
        return (
            <AppLoading
                startAsync={fetchFonts}
                onFinish={() => setDataLoaded(true)}
            />
        );
    }

    if (DataLoading) {
        return (
            <SafeAreaView style={style.safeArea}>
                <View style={{ flex: 1, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                    <Image
                        source={require('../assets/images/book.gif')}
                        style={{ width: "50%", height: "30%" }}
                    />
                </View>
            </SafeAreaView>);
    } else {
        return (

            <SafeAreaView style={style.safeArea}>
                <StatusBar translucent color="black" backgroundColor="black" />
                <TouchableOpacity onPress={openDraw} style={{ marginTop: "2%" }}>
                    <Header />
                </TouchableOpacity>
                <FlatList
                    data={holidaysList}
                    renderItem={({ item }) => <Holiday name={item.name} date={Moment(item.date).format('DD MMM')} />}
                    keyExtractor={item => item.uuid}
                />
            </SafeAreaView>

        );
    }


}


const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const style = StyleSheet.create({

    safeArea: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? STATUSBAR_HEIGHT + 30 : StatusBar.currentHeight ,
        paddingHorizontal: "4%",
        backgroundColor:"white"

    },



});
