import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    Modal,
    Alert,
    TouchableOpacity,
    Dimensions,
    Button,
    Image,

    TextInput

} from "react-native";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ReadNote from './ReadNote'
import LottieView from 'lottie-react-native';
import Header from './components/Header';
import { LinearGradient } from 'expo-linear-gradient';
import * as Calendar from 'expo-calendar';
import DateTimePicker from '@react-native-community/datetimepicker';
import NoteColumn from './components/Task'
import { AsyncStorage } from "react-native";

import * as firebase from 'firebase'
const { height, width } = Dimensions.get("screen");
const fetchFonts = () => {
    console.log("loading font");
    return Font.loadAsync({
        "Nunito-regular": require("../assets/fonts/Nunito-Regular.ttf"),
        "Nunito-Bold": require("../assets/fonts/Nunito-Bold.ttf"),
        "Nunito-SemiBold": require("../assets/fonts/Nunito-SemiBold.ttf"),
    });
};


export default function Tasks({ navigation }) {
    const [EventCal, setEventCal] = useState(null)

    useEffect(() => {
        (async () => {
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status === 'granted') {
                const calendars = await Calendar.getCalendarsAsync();
                console.log('Here are all your calendars:');
                console.log(calendars[0]);
                setEventCal(calendars[0])
                const calendar = calendars.find(({ isPrimary }) => isPrimary);
                console.log(EventCal)
                //const events = await Calendar.getEventsAsync(["1","2","3","4","5"], "2018-05-16T20:00:00.000Z", "2020-04-16T20:00:00.000Z")
                //const events = await Calendar.openEventInCalendar("1")
                //console.log("all your events: ", events)
            }
        }
        )();

    }, []);




    const db = firebase.firestore();
    function fetchData(value) {
        setDataLoading(true)
        setallNotes([])
        let notesRef = db.collection('tasks');
        notesRef.where('uuid', '==', value).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());

                    setallNotes(prevState => [...prevState, { id: doc.id, note: doc.data().note, title: doc.data().title, createdOn: doc.data().createdOn, due: doc.data().dueOn }])
                });
                setDataLoading(false)

                console.log(allNotes)
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
                fetchData(value)
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

    const [globalName, setglobalName] = useState(null)
    const [globalemail, setglobalemail] = useState(null)
    const [globaluid, setglobaluid] = useState(null)

    const [allNotes, setallNotes] = useState([])
    const [dataLoaded, setDataLoaded] = useState(false);
    const [Note, setNote] = useState([]);
    const [Title, setTitle] = useState([]);
    const [DataLoading, setDataLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    const openDraw = () => {
        navigation.openDrawer();
    }
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('datetime');
    const [show, setShow] = useState(false);
    const [Edit, setEdit] = useState(false);
    const [editUId, seteditUId] = useState(null);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };
    const handleEdit = (i) => {
        setEdit(true)
        setNote(i.note)
        console.log(Note)
        setModalVisible(!modalVisible)
        seteditUId(i.id)
        console.log(i)

    }

    const handleSubmit = () => {
        setShow(!show)
    }
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

    const deleteNote = async (uid) => {
        try {
            db.collection('tasks').doc(uid).delete();
            var foundIndex = allNotes.findIndex(x => x.id == uid);
            let newArray = [...allNotes]
            newArray.splice(uid, 1);
            setallNotes(newArray)
        } catch (e) {
            console.error(e)
        }
    }

    const newEvent = async () => {

        console.log("EventCal is calledd")
        const details = {
            allDay: true,
            alarms: [{
                relativeOffset: -1,
                method: Calendar.AlarmMethod.ALERT,
            }],
            location: "...",
            notes: Note,
            startDate: date,
            endDate: date,
            title: Title,
            url: ""
        };

        try {
            console.log('Adding Event');

            const eventId = await Calendar.createEventAsync(EventCal.id, details);

            console.log("Event Id", eventId);
        }
        catch (error) {
            console.log('Error', error);
        }
    }
    const addNote = async () => {
        try {
            setDataLoading(!DataLoading)
            setallNotes(null)
            db.collection('tasks').add({
                name: globalName,
                title: Title,
                note: Note,
                createdOn: new Date(),
                dueOn: date,
                uuid: globaluid
            }).then(ref => {
                newEvent()
                console.log('Added document with ID: ', ref.id);
                setModalVisible(!modalVisible)
                setNote('')
                fetchData(globaluid)
            });
        } catch (e) {
            console.error(e)
        }

    }

    const updateNote = async () => {
        try {
            await db.collection('tasks').doc(editUId).update({
                note: Note
            }).then(() => {
                console.log('Profile Successfully Edited!');

                var foundIndex = allNotes.findIndex(x => x.id == editUId);
                let newArray = [...allNotes]
                newArray[foundIndex].note = Note;
                setallNotes(newArray)
                setModalVisible(!modalVisible)
                seteditUId(null)
                setEdit(false)
            }).catch((error) => {
                console.log('Error updating the document:', error);
            })
        } catch (e) {
            console.error(e)
        }
    }

    const handleRead = (item) => {
        console.log((item.createdOn.toDate()).toDateString())
        navigation.navigate('ReadTask', { Note: item.note, created: (item.createdOn.toDate()).toDateString(), due: (item.due.toDate()).toDateString(), title: item.title })
    }
    const enableTaskModal = () => { console.log('tapped'); setModalVisible(!modalVisible); }



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
        if (allNotes.length == 0) {
            return (
                <SafeAreaView style={style.safeArea}>
                    <TouchableOpacity onPress={openDraw} style={{ marginTop: "2%" }}>
                        <Header />
                    </TouchableOpacity>
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
                            <Text style={{ fontFamily: "Nunito-Bold", fontSize: 22, textAlign: "center" }}>Add new task</Text>
                            <TextInput
                                style={[style.noteInput, { height: "8%", marginVertical: "5%", fontFamily: "Nunito-Bold" }]}
                                placeholder="Task title"
                                onChangeText={text => setTitle(text)}
                                value={Title}
                                multiline={true}
                            />
                            <TextInput
                                style={style.noteInput}
                                placeholder="Task Description"
                                onChangeText={text => setNote(text)}
                                value={Note}
                                multiline={true}
                            />
                            <TouchableOpacity onPress={handleSubmit} style={style.signUp}>
                                <LinearGradient
                                    colors={['#0984e3', '#0984e3']}
                                    style={style.signUp}
                                >
                                    <Text style={[style.textSign, {
                                        color: '#fff', textAlign: "center"
                                    }]}>Due on{"\n"}{date ? date.toDateString() : null}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
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
                                    <Text style={style.buttonText}>Add</Text>
                                </TouchableOpacity>


                            </View>

                        </View>
                    </Modal>
                    <View style={{ flex: 1, justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                        <Image
                            source={require('../assets/images/empty.gif')}
                            style={{ width: "50%", height: "30%", marginVertical: "10%" }}
                        />
                        <Text style={{ textAlign: "center", fontFamily: "Nunito-SemiBold", fontSize: 18, color: 'grey' }}>You do not have any notes..</Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            borderWidth: 1,
                            borderColor: 'rgba(0,0,0,0.2)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 70,
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                            height: 70,
                            backgroundColor: '#0984e3',
                            borderRadius: 100,
                        }}
                        onPress={enableTaskModal}
                    >
                        <MaterialCommunityIcons name="plus" size={28} style={style.icons} color="white" />

                    </TouchableOpacity>
                </SafeAreaView>)

        }
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
                        <Text style={{ fontFamily: "Nunito-Bold", fontSize: 22, textAlign: "center" }}>Add new task</Text>
                        <TextInput
                            style={[style.noteInput, { height: "8%", marginVertical: "5%", fontFamily: "Nunito-Bold" }]}
                            placeholder="Task title"
                            onChangeText={text => setTitle(text)}
                            value={Title}
                            multiline={true}
                        />
                        <TextInput
                            style={style.noteInput}
                            placeholder="Task Description"
                            onChangeText={text => setNote(text)}
                            value={Note}
                            multiline={true}
                        />
                        <TouchableOpacity onPress={handleSubmit} style={style.signUp}>
                            <LinearGradient
                                colors={['#0984e3', '#0984e3']}
                                style={style.signUp}
                            >
                                <Text style={[style.textSign, {
                                    color: '#fff', textAlign: "center"
                                }]}>Due on{"\n"}{date ? date.toDateString() : null}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
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
                                <Text style={style.buttonText}>Add</Text>
                            </TouchableOpacity>


                        </View>

                    </View>
                </Modal>

                <TouchableOpacity onPress={openDraw} style={{ marginTop: "2%" }}>
                    <Header />
                </TouchableOpacity>
                <Text style={[style.menuHeading, { padding: "3%" }]}>Your tasks..</Text>
                <FlatList
                    data={allNotes}
                    renderItem={({ item }) => <NoteColumn item={item} read={handleRead} edit={handleEdit} deletenote={deleteNote} />}
                    keyExtractor={item => item.id}
                />
                <TouchableOpacity
                    style={{
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 70,
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        height: 70,
                        backgroundColor: '#0984e3',
                        borderRadius: 100,
                    }}
                    onPress={enableTaskModal}
                >
                    <MaterialCommunityIcons name="plus" size={28} style={style.icons} color="white" />

                </TouchableOpacity>
            </SafeAreaView>

        );
    }

}


const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const style = StyleSheet.create({
    icons: {
        marginHorizontal: "1%"
    },
    safeArea: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? STATUSBAR_HEIGHT + 30 : StatusBar.currentHeight,
        paddingHorizontal: "3%",
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
    GlobalStatus: {
        backgroundColor: "#E1F5FE",
        borderRadius: 12,
        padding: "4%",
        marginVertical: "5%",


    },

    menuHeading: {

        textAlign: "left",
        fontFamily: "Nunito-SemiBold",
        fontSize: height / 40,
        color: "#006064"
    },
    noteInput: {
        height: height / 2.5,
        width: "90%",
        borderWidth: 0.5,
        fontFamily: "Nunito-regular",
        fontSize: 18,
        borderColor: "grey",
        borderRadius: 10,
        textAlign: "center",
        padding: "2%"
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

    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    signUp: {
        width: '95%',
        marginTop: "5%",
        paddingBottom: "5%",

        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderColor: "#0984e3",

    },
    textSign: {
        fontSize: 18,
        fontFamily: "Nunito-SemiBold",
    }


});
