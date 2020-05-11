import React, { useState, useEffect } from "react";
import {
    View,
    Text,

    StyleSheet,
    TouchableOpacity,
    Dimensions

} from "react-native";
import { AntDesign } from '@expo/vector-icons';

export default function Holiday({ name, date }) {
    return (
        <View style={style.GlobalStatus} elevation={3}>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <View style={{ flex: 3, alignItems: "center" }}>
                    <AntDesign name="calendar" size={24} color="black" />
                    <Text style={style.menuHeading}>
                        {date}
                    </Text>

                </View>
                <View style={{ flex: 9, alignContent: "center", paddingLeft: "2%", paddingTop: "2%" }} >
                    <Text style={{ fontSize: 20, fontFamily: "Nunito-SemiBold" }}>{name}</Text>
                </View>
            </View>

        </View>

    );
}

const { height, width } = Dimensions.get("screen");
const iconHeight = height * 0.1

const style = StyleSheet.create({
    GlobalStatus: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: "3%",
        marginVertical: "2.2%",
        marginHorizontal:"0.5%"


    },
    menuHeading: {


        fontFamily: "Nunito-SemiBold",
        fontSize: 16
    },
    icons: {
        marginHorizontal: "1%"
    },
});
