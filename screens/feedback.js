import React, { useState, useEffect } from "react";
import {
    View,
    Text,

    StyleSheet,
    StatusBar,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    TextInput

} from "react-native";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import { LinearGradient } from 'expo-linear-gradient';
import * as MailComposer from 'expo-mail-composer';

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


export default function Feedback({ navigation }) {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [feedbackData, setfeedbackData] = useState(null);

    const openDraw = () => {
        navigation.openDrawer();
    }
    const handleSubmit = () => {
        console.log("called")
        MailComposer.composeAsync({
            recipients: ["kalbhorprachi12@gmail.com"],
            subject: "My Diary Feedback",
            body: feedbackData,
        }
        )
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
            <ScrollView style={{ marginVertical: "8%" }}>
                <View style={{ flex: 1, padding: "5%", justifyContent: 'center', alignItems: "center" }}>

                    <Text style={style.text}>
                        Tell us about your experience?
                </Text>
                    <TextInput
                        style={style.noteInput}
                        placeholder="Explain your feedback here..."
                        onChangeText={text => setfeedbackData(text)}
                        multiline={true}
                    />
                    <TouchableOpacity onPress={handleSubmit} style={style.signIn}>
                        <LinearGradient
                            colors={['#03A9F4', '#03A9F4']}
                            style={style.signIn}
                        >
                            <Text style={[style.textSign, {
                                color: '#fff'
                            }]}>Submit</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>

    );


}


const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const style = StyleSheet.create({

    safeArea: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? STATUSBAR_HEIGHT + 30 : StatusBar.currentHeight,
        paddingHorizontal: "3%",
        backgroundColor: "white"

    },
    text: { fontFamily: "Nunito-SemiBold", fontSize: 20, color: "#576574", textAlign: "justify" },
    noteInput: {
        marginVertical: "8%",
        height: height / 1.8,
        width: "100%",
        borderWidth: 0.5,
        textAlign: "center",
        fontFamily: "Nunito-regular",
        fontSize: 18,
        borderColor: "grey",
        borderRadius: 10,
        padding: "2%"
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    signUp: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontFamily: "Nunito-SemiBold",
    }

});
