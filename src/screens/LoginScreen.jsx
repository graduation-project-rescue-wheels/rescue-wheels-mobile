import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { AntDesign, Fontisto, MaterialIcons } from '@expo/vector-icons'
import { useState } from 'react'
import PoppinsText from '../components/PoppinsText'

const LoginScreen = () => {
    const [email, setEmail] = useState({
        value: "",
        isFocused: false
    })
    const [password, setPassword] = useState({
        value: "",
        isFocused: false
    })

    const handleSignInBtn = () => {
        //TODO
    }

    const handleSignInWithGoogleBtn = () => {

    }

    const handleForgotPasswordOnPress = () => {
        //TODO
    }

    const handleSignUpOnPress = () => {
        //TODO
    }

    return (
        <View style={styles.container}>
            <PoppinsText style={styles.welcomeText}>Welcome to <PoppinsText
                style={{ color: '#E48700' }}
            >
                Rescue Wheels
            </PoppinsText>
            </PoppinsText>
            <PoppinsText style={styles.title}>Sign In</PoppinsText>
            <PoppinsText style={styles.label}>Enter your username or E-mail</PoppinsText>
            <View style={{
                ...styles.inputView,
                borderColor: email.isFocused ? '#E48700' : '#ADADAD'
            }}>
                <Fontisto
                    name='email'
                    style={{
                        ...styles.icon,
                        color: email.isFocused ? '#E48700' : '#ADADAD'
                    }} />
                <TextInput
                    placeholder='Username or E-mail'
                    keyboardType='email-address'
                    value={email.value}
                    onChangeText={e => setEmail(prev => ({ ...prev, value: e }))}
                    style={styles.textInput}
                    placeholderTextColor={'#ADADAD'}
                    onFocus={() => setEmail(prev => ({ ...prev, isFocused: true }))}
                    onBlur={() => setEmail(prev => ({ ...prev, isFocused: false }))}
                />
            </View>
            <PoppinsText style={styles.label}>Enter your password</PoppinsText>
            <View style={{
                ...styles.inputView,
                borderColor: password.isFocused ? '#E48700' : '#ADADAD'
            }}>
                <MaterialIcons
                    name='password'
                    style={{
                        ...styles.icon,
                        color: password.isFocused ? '#E48700' : '#ADADAD'
                    }}
                />
                <TextInput
                    placeholder='Password'
                    secureTextEntry={true}
                    value={password.value}
                    onChangeText={e => setPassword(prev => ({ ...prev, value: e }))}
                    style={styles.textInput}
                    placeholderTextColor={'#ADADAD'}
                    onFocus={() => setPassword(prev => ({ ...prev, isFocused: true }))}
                    onBlur={() => setPassword(prev => ({ ...prev, isFocused: false }))}
                />
            </View>
            <PoppinsText
                style={styles.forgotPasswordText}
                onPress={handleForgotPasswordOnPress}
            >
                Forgot password?
            </PoppinsText>
            <TouchableOpacity
                style={{ ...styles.button, backgroundColor: '#E48700' }}
                onPress={handleSignInBtn}
            >
                <PoppinsText style={{ ...styles.buttonText, color: 'white' }}>Sign in</PoppinsText>
            </TouchableOpacity>
            <PoppinsText style={styles.orText}>or</PoppinsText>
            <TouchableOpacity
                style={{ ...styles.button, backgroundColor: '#FFF4E3', flexDirection: 'row' }}
                onPress={handleSignInWithGoogleBtn}
            >
                <AntDesign name='google' style={styles.googleIcon} />
                <PoppinsText style={styles.googleText}>Sign in with Google</PoppinsText>
            </TouchableOpacity>
            <PoppinsText style={styles.signUpText}>Don't have an account? <PoppinsText
                style={{
                    color: '#E48700'
                }}
                onPress={handleSignUpOnPress}
            >
                Sign Up
            </PoppinsText>
            </PoppinsText>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    title: {
        fontSize: 32,
    },
    welcomeView: {
        width: '100%',
        flexDirection: 'row'
    },
    welcomeText: {
        fontSize: 16,
    },
    inputView: {
        width: '100%',
        borderWidth: 1,
        marginVertical: 16,
        borderRadius: 16,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        paddingRight: 8,
        fontSize: 20
    },
    textInput: {
        paddingVertical: 4,
        flex: 1,
        fontFamily: 'Poppins-Medium'
    },
    button: {
        marginVertical: 16,
        padding: 8,
        borderRadius: 16,
        alignItems: 'center'
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 20
    },
    signUpText: {
        fontSize: 16,
    },
    image: {
        position: 'absolute',
        flex: 1,
    },
    gradient: {
        flex: 1,
        paddingHorizontal: 16,
        justifyContent: 'center'
    },
    forgotPasswordText: {
        textDecorationLine: 'underline',
        fontSize: 16,
        marginTop: 16
    },
    label: {
        fontSize: 14
    },
    orText: {
        textAlign: 'center',
        fontSize: 20
    },
    googleIcon: {
        fontSize: 20,
        color: '#E48700',
        marginVertical: 8
    },
    googleText: {
        fontSize: 20,
        color: '#E48700',
        textAlign: 'center',
        width: '100%'
    }
})