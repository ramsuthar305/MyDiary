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
import { AppLoading } from "expo";
import Header from './components/Header'
const { height, width } = Dimensions.get("screen");
const fetchFonts = () => {
    console.log("loading font");
    return Font.loadAsync({
        "Nunito-regular": require("../assets/fonts/Nunito-Regular.ttf"),
        "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
        "Nunito-SemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
    });
};


export default function ReadNote({ navigation }) {
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

            <View style={{ flex: 1, padding: "5%" }}>
                <Text style={{ fontFamily: "Nunito-SemiBold", fontSize: 20, color: "#718093", textAlign: "justify" }}>{navigation.getParam('Date')}</Text>
                <Text style={{ fontFamily: "Nunito-SemiBold", fontSize: 20, color: "#576574", textAlign: "justify" }}>{navigation.getParam('Note')}</Text>
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

    },


});
