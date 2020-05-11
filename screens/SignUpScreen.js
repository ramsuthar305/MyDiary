import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Platform, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import * as firebase from 'firebase'
import AuthContext from './App'
import { AsyncStorage } from "react-native";


const SignUpScreen = ({ navigation }) => {

    const [email, setEmail] = React.useState('')
    const [name, setname] = React.useState('')
    const [checkTextNameChange, setcheckTextNameChange] = React.useState(false)
    const [password, setPassword] = React.useState('')
    const [check_textInputChange, setcheck_textInputChange] = React.useState(false)
    const [secureTextEntry, setsecureTextEntry] = React.useState(true)
    const [confirm_password, setconfirm_password] = React.useState(true)
    const [confirmSecureTextEntry, setconfirmSecureTextEntry] = React.useState(true)
    const [passwordMatch, setpasswordMatch] = React.useState(null)

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const textInputChange = (val) => {
        if (reg.test(val) === true) {
            setEmail(val)
            setcheck_textInputChange(true)

        } else {
            setEmail(val)
            setcheck_textInputChange(false)
        }
    }

    const handlePasswordChange = (val) => {
        setPassword(val)
    }

    const textNameChange = (val) => {
        setname(val)
    }

    const updateSecureTextEntry = () => {
        setsecureTextEntry(!setsecureTextEntry)
    }
    _storeData = async (name, email, uid) => {
        try {
            await AsyncStorage.setItem('name', name);
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('uid', uid);
        } catch (error) {
            console.error(error)
        }
    }
    const handleForm = e => {
        e.preventDefault();
        const db = firebase.firestore();

        console.log(`called ${email} ${password}`)
        if (password === confirm_password) {
            setpasswordMatch(true)
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(res => {
                    if (res.user) {
                        _storeData(name, email, res.user.uid)
                        db.collection('users').add({
                            name: name,
                            email: email,
                            uuid: res.user.uid
                        }).then(ref => {

                            console.log('Added document with ID: ', ref.id);

                        });
                        console.log(res.user)
                        AuthContext.isLoggedIn = true
                        AuthContext.email = email
                        navigation.navigate('Home')
                    }
                })
                .catch(e => {

                    console.log(e.message)
                });
        } else {
            setpasswordMatch(false)
        }
    };

    const handleConfirmPasswordChange = (val) => {
        setconfirm_password(val)

    }

    const updateConfirmSecureTextEntry = () => {
        setconfirmSecureTextEntry(!confirmSecureTextEntry)
    }

    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.text_header}>Register Now!</Text>
                </View>
                <Animatable.View style={styles.footer} animation="fadeInUpBig">
                    <Text style={styles.text_footer}>Name</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="user-o"
                            size={18}
                        />
                        <TextInput
                            placeholder="Full name"
                            style={styles.textInput}
                            autoCapitalize="none"
                            keyboardType="default"
                            onChangeText={(val) => textNameChange(val)}
                        />
                        {checkTextNameChange ?
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather
                                    name="check-circle"
                                    size={18}
                                    color="green"
                                />
                            </Animatable.View>
                            : null}
                    </View>
                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Email ID</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="envelope-o"
                            size={18}
                        />
                        <TextInput
                            placeholder="Your Email"
                            style={styles.textInput}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            onChangeText={(val) => textInputChange(val)}
                        />
                        {check_textInputChange ?
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather
                                    name="check-circle"
                                    size={18}
                                    color="green"
                                />
                            </Animatable.View>
                            : null}
                    </View>

                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Password</Text>
                    <View style={styles.action}>
                        <TextInput
                            placeholder="Your Password"
                            secureTextEntry={secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handlePasswordChange(val)}
                        />
                        <TouchableOpacity
                            onPress={updateSecureTextEntry}
                        >
                            {secureTextEntry ?
                                <Feather
                                    name="eye-off"
                                    color="grey"
                                    size={18}
                                />
                                :
                                <Feather
                                    name="eye"
                                    color="grey"
                                    size={18}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Confirm Password</Text>
                    <View style={styles.action}>

                        <TextInput
                            placeholder="Confirm Your Password"
                            secureTextEntry={confirmSecureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handleConfirmPasswordChange(val)}
                        />
                        <TouchableOpacity
                            onPress={updateConfirmSecureTextEntry}
                        >
                            {confirmSecureTextEntry ?
                                <Feather
                                    name="eye-off"
                                    color="grey"
                                    size={18}
                                />
                                :
                                <Feather
                                    name="eye"
                                    color="grey"
                                    size={18}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    {passwordMatch == false ? <Text style={{ fontFamily: "Nunito-SemiBold", color: "red" }}> X Passwords does not match</Text> : null}
                    <View style={styles.button}>
                        <TouchableOpacity onPress={handleForm} style={styles.signUp}>
                            <LinearGradient
                                colors={['#03A9F4', '#03A9F4']}
                                style={styles.signUp}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>Sign Up</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={[styles.signIn, {
                                borderColor: '#03A9F4',
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#03A9F4'
                            }]}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </View>
        </TouchableWithoutFeedback>
    );
}

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#03A9F4'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 4,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30,
        fontFamily: "Nunito-Bold"
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18,
        fontFamily: "Nunito-SemiBold"
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
        fontFamily: "Nunito-SemiBold"
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '90%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    signUp: {
        width: '95%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: "Nunito-SemiBold"
    }
});




