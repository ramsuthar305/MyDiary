import React, { useState, useEffect } from "react";
import {
    View,
    Text,

    StyleSheet,
    StatusBar,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,


} from "react-native";
import * as Font from "expo-font";
import WebView from 'react-native-webview'
import { AppLoading } from "expo";
import Header from './components/Header'
import * as firebase from 'firebase'
import PDFReader from 'rn-pdf-reader-js'

//const PdfReader = ({ url: uri }) => <WebView style={{ flex: 1 }} source={{ uri }} />


const fetchFonts = () => {
    console.log("loading font");
    return Font.loadAsync({
        "Nunito-regular": require("../assets/fonts/Nunito-Regular.ttf"),
        "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
        "Nunito-SemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
    });
};


export default function Timetable({ navigation }) {
    const [dataLoaded, setDataLoaded] = useState(false);

    const [timetable, settimetable] = useState(null);
    useEffect(() => {
        var storage = firebase.storage();
        var pathReference = storage.ref('syllabus.pdf').getDownloadURL().then(function (url) {
            //console.log(url)
            settimetable(pathReference)
        }).catch(function (error) {
            console.error(error)
        });
        //console.log(pathReference)
    }, [])
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

    return (

        <SafeAreaView style={style.safeArea}>
            <StatusBar translucent color="black" backgroundColor="black" />
            <TouchableOpacity onPress={openDraw} style={{ marginTop: "2%" }}>
                <Header />
            </TouchableOpacity>



            <PDFReader
                source={{
                    uri: 'https://firebasestorage.googleapis.com/v0/b/my-diary-276709.appspot.com/o/syllabus.pdf?alt=media&token=d222f166-c17b-42bb-81a8-348d21ff4a22',
                }}
                style={{ backgroundColor: "White" }}
                webviewStyle={{ backgroundColor: "White" }}
                
                //withScroll={true}
            />

        </SafeAreaView>

    );


}


const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const style = StyleSheet.create({

    safeArea: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? STATUSBAR_HEIGHT + 30 : StatusBar.currentHeight,
        paddingHorizontal: "3%",

    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }


});
