import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { AntDesign, Fontisto, MaterialIcons } from '@expo/vector-icons'
import { useState } from 'react'
import PoppinsText from '../components/PoppinsText'
import { useDispatch } from 'react-redux'
import { signInAsync } from '../store/userSlice'
import showToast from '../components/Toast'
import { emailRegex } from '../utils/regex'

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState({
        value: "",
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [password, setPassword] = useState({
        value: "",
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const dispatch = useDispatch()

    const validateEmail = () => {
        if (email.value.length === 0) {
            setEmail(prev => ({
                ...prev,
                validation: {
                    isValid: false,
                    message: 'Please enter an E-mail'
                }
            }))
        } else if (!emailRegex.test(email.value)) {
            setEmail(prev => ({
                ...prev,
                validation: {
                    isValid: false,
                    message: 'Invalid E-mail address'
                }
            }))
        } else {
            setEmail(prev => ({
                ...prev,
                validation: {
                    isValid: true,
                    message: ''
                }
            }))
        }
    }

    const validatePassword = () => {
        if (password.value.length === 0) {
            setPassword(prev => ({
                ...prev,
                validation: {
                    isValid: false,
                    message: 'Please enter your password'
                }
            }))
        } else {
            setPassword(prev => ({
                ...prev,
                validation: {
                    isValid: true,
                    message: ''
                }
            }))
        }
    }

    const handleEmailTextInputOnBlur = () => {
        setEmail(prev => ({ ...prev, isFocused: false }))
        validateEmail()
    }

    const handlePasswordTextInputOnBlur = () => {
        setPassword(prev => ({ ...prev, isFocused: false }))
        validatePassword()
    }

    const handleSignInBtn = () => {
        validateEmail()
        validatePassword()

        if (email.validation.isValid && password.validation.isValid) {
            dispatch(signInAsync({ email: email.value, passowrd: password.value }))
        } else {
            showToast('Invalid E-mail or password')
            console.log('LoginScreen sign in button:', 'Invalid E-mail or password');
        }
    }

    const handleSignInWithGoogleBtn = () => {
        //TODO
    }

    const handleForgotPasswordOnPress = () => {
        navigation.navigate('Forgot password')
    }

    const handleSignUpOnPress = () => {
        navigation.navigate('Sign up')
    }

    return (
        <View style={styles.container}>
            <PoppinsText style={styles.welcomeText}>Welcome to <PoppinsText
                style={{ color: '#E48700' }}
            >
                Rescue Wheels
            </PoppinsText>
            </PoppinsText>
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 8
                }}
            >
                <PoppinsText style={styles.title}>Sign In</PoppinsText>
                <View style={{ width: '53%' }}>
                    <PoppinsText style={styles.signUpText}>Don't have an account?</PoppinsText>
                    <PoppinsText
                        style={{
                            color: '#E48700'
                        }}
                        onPress={handleSignUpOnPress}
                    >
                        Sign Up
                    </PoppinsText>
                </View>
            </View>
            <PoppinsText style={styles.label}>Enter your username or E-mail</PoppinsText>
            <View style={{
                ...styles.inputView,
                borderColor: email.isFocused ?
                    '#E48700' : email.validation.isValid ? '#ADADAD' : 'red'
            }}>
                <Fontisto
                    name='email'
                    style={{
                        ...styles.icon,
                        color: email.isFocused ?
                            '#E48700' : email.validation.isValid ? '#ADADAD' : 'red'
                    }} />
                <TextInput
                    placeholder='Username or E-mail'
                    keyboardType='email-address'
                    value={email.value}
                    onChangeText={e => setEmail(prev => ({ ...prev, value: e }))}
                    style={styles.textInput}
                    placeholderTextColor={'#ADADAD'}
                    onFocus={() => setEmail(prev => ({ ...prev, isFocused: true }))}
                    onBlur={handleEmailTextInputOnBlur}
                />
            </View>
            {
                email.validation.isValid ?
                    null : <PoppinsText style={styles.validationMessageText}>{email.validation.message}</PoppinsText>
            }
            <PoppinsText style={styles.label}>Enter your password</PoppinsText>
            <View style={{
                ...styles.inputView,
                borderColor: password.isFocused ?
                    '#E48700' : password.validation.isValid ? '#ADADAD' : 'red'
            }}>
                <MaterialIcons
                    name='password'
                    style={{
                        ...styles.icon,
                        color: password.isFocused ?
                            '#E48700' : password.validation.isValid ? '#ADADAD' : 'red'
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
                    onBlur={handlePasswordTextInputOnBlur}
                />
            </View>
            {
                password.validation.isValid ?
                    null : <PoppinsText style={styles.validationMessageText}>{password.validation.message}</PoppinsText>
            }
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
        backgroundColor: 'white'
    },
    title: {
        fontSize: 32,
    },
    welcomeText: {
        fontSize: 16,
    },
    inputView: {
        width: '100%',
        borderWidth: 1,
        marginTop: 16,
        marginBottom: 8,
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
        fontSize: 14,
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
    },
    validationMessageText: {
        color: 'red',
        marginBottom: 16
    }
})