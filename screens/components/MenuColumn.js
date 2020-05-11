import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    Dimensions

} from "react-native";

export default function MenuButton({ title, image, onPress }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={style.GlobalStatus} elevation={3}>
                <Image source={image} style={style.menuIcon} />
                <Text style={style.menuHeading}>{title}</Text>
            </View>
        </TouchableOpacity>

    )
}

const { height, width } = Dimensions.get("screen");
const iconHeight = height * 0.1

const style = StyleSheet.create({
    GlobalStatus: {
        backgroundColor: "white",
        borderRadius: 15,
        padding: "5%",
        margin: "5%",
        width: width / 3,
        alignSelf:"center",
        alignItems: 'center',

    },

    menuHeading: {

        marginTop: "8%",
        fontFamily: "Nunito-SemiBold",
        fontSize: height / 40,
        color: "#1e3799"
    },
    menuIcon: {
        width: '60%',
        height: undefined,

        aspectRatio: 1,


    }
});
