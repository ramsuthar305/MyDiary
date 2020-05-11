import React, { useState, useEffect } from "react";
import {
    View,
    Text,

    StyleSheet,
    TouchableOpacity,
    Dimensions

} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function NoteColumn({ item, read, edit, deletenote }) {
    return (
        <TouchableOpacity onPress={() => read(item)}>
            <View style={style.GlobalStatus} elevation={3}>
                <View style={{ flexDirection: "row", justifyContent: "center", alignContent: "center" }}>
                    <View style={{ flexDirection: "column" }}>

                        <Text numberOfLines={1} ellipsizeMode="tail" style={style.menuHeading}>{item.title}</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[style.menuHeading, { fontSize: height / 55 }]}>Due on: {(item.due.toDate()).toDateString()}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <TouchableOpacity onPress={() => deletenote(item.id)}>
                            <MaterialCommunityIcons name="trash-can-outline" size={22} style={style.icons} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        </TouchableOpacity>

    )
}

const { height, width } = Dimensions.get("screen");
const iconHeight = height * 0.1

const style = StyleSheet.create({
    GlobalStatus: {
        backgroundColor: "#E1F5FE",
        borderRadius: 12,
        padding: "4%",
        marginVertical: "2.2%",


    },
    menuHeading: {

        textAlign: "left",
        fontFamily: "Nunito-SemiBold",
        fontSize: height / 40,
        width: width / 1.4,
        color: "#006064"
    },
    icons: {
        marginHorizontal: "1%"
    },
});
