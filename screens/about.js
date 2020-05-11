import React, { useState, useEffect } from "react";
import {
    View,
    Text,

    StyleSheet,
    StatusBar,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    Image,

} from "react-native";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import Header from './components/Header'
import LottieView from 'lottie-react-native';


const { height, width } = Dimensions.get("screen");
const fetchFonts = () => {
    console.log("loading font");
    return Font.loadAsync({
        "Nunito-regular": require("../assets/fonts/Nunito-Regular.ttf"),
        "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
        "Nunito-SemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
    });
};


export default function About({ navigation }) {
    const [dataLoaded, setDataLoaded] = useState(false);

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

            <View style={{ flex: 1, padding: "5%", justifyContent: 'center', alignItems: "center" }}>
                <Image
                    source={require('../assets/images/tasks.gif')}
                    style={{ width: "100%", height: "30%" }}

                />
                <Text style={style.text}>
                    "MyDiary" is simply space application where you can freely record personal daily experiences. So instead of opting for a traditional diary or a notebook where you can pen down your academic details , you can use a digital journal software and have it with you anytime, any day and anywhere.
                    On a final note, sticking to your schedule and jotting your timetable, holiday lists and private details has never been more fun. Due to this, the Journey is much more than an online version of dear diary!
                </Text>
                <Text style={[style.text, {textAlign:"center"}]}>
                    {"\n"}Team{"\n"}Rutuja Kalbhor, Prachi Kalbhor{"\n"} Rajendra Kelwa, Vivek Rote
                </Text>
            </View>
        </SafeAreaView>

    );


}


const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const style = StyleSheet.create({

    safeArea: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? STATUSBAR_HEIGHT + 30 : StatusBar.currentHeight ,
        paddingHorizontal: "3%",
        backgroundColor: "white"

    },
    text: { fontFamily: "Nunito-SemiBold", fontSize: 20, color: "#576574", textAlign: "justify" }

});
