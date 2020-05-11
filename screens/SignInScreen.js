import React from 'react';
import { View, Text, AsyncStorage, StyleSheet, TouchableOpacity, Platform, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { FontAwesome } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import * as firebase from 'firebase'
import AuthContext from './App'


const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [check_textInputChange, setcheck_textInputChange] = React.useState(false)
    const [secureTextEntry, setsecureTextEntry] = React.useState(true)

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

    const updateSecureTextEntry = () => {
        setsecureTextEntry(!setsecureTextEntry)
    }

    const handleForm = e => {
        e.preventDefault();

        console.log(`called ${email} ${password}`)
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(res => {
                if (res.user) {
                    AuthContext.isLoggedIn = true
                    AuthContext.email = email
                    navigation.navigate('Home')
                }
                var user = firebase.auth().currentUser;
                console.log(user)
            })
            .catch(e => {

                console.log(e.message)
            });
    };

    const handleGoogleSingUp = e => {
        firebase.auth().signInWithCredential(new firebase.auth.GoogleAuthProvider()).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            console.error(error)
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });

    }

    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.text_header}>Welcome Back!</Text>
                </View>
                <Animatable.View style={styles.footer} animation="fadeInUpBig">

                    <Text style={styles.text_footer}>Email address</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="user-o"
                            size={18}
                        />
                        <TextInput
                            placeholder="Your email"
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
                        <Feather
                            name="lock"
                            size={18}
                        />
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
                    <View style={styles.button}>
                        <TouchableOpacity onPress={handleForm} style={styles.signIn}>
                            <LinearGradient
                                colors={['#03A9F4', '#03A9F4']}
                                style={styles.signIn}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>Sign In</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')} style={[styles.signUp, {
                            borderColor: '#03A9F4',
                            borderWidth: 1,
                            marginTop: 15
                        }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#03A9F4'
                            }]}>Sign up with Email</Text>
                        </TouchableOpacity>

                    </View>
                </Animatable.View>
            </View>
        </TouchableWithoutFeedback>
    );
}

export default SignInScreen;

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
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontFamily: "Nunito-Bold",
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontFamily: "Nunito-SemiBold",
        fontSize: 18
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
        fontFamily: "Nunito-SemiBold",
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
        width: '81%',
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


