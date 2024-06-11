import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { AntDesign, Fontisto, MaterialIcons } from '@expo/vector-icons'
import { useState } from 'react'
import PoppinsText from '../components/PoppinsText'
import { useDispatch } from 'react-redux'
import showToast from '../components/Toast'
import { validateEmail, validatePassword } from '../utils/inputValidations'
import CustomTextInput from '../components/CustomTextInput'
import ValidationMessage from '../components/ValidationMessage'
import { signInAsync } from '../store/userAsyncThunks'
import { mainColor, secondryColor } from '../colors'

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

    const handleEmailTextInputOnBlur = () => {
        setEmail(prev => ({
            ...prev,
            isFocused: false,
            validation: validateEmail(email.value)
        }))
    }

    const handlePasswordTextInputOnBlur = () => {
        setPassword(prev => ({
            ...prev,
            isFocused: false,
            validation: validatePassword(password.value)
        }))
    }

    const handleSignInBtn = () => {
        const emailValidationResult = validateEmail(email.value)
        const passwordValidationResult = validatePassword(password.value)

        setEmail(prev => ({
            ...prev,
            validation: emailValidationResult
        }))

        setPassword(prev => ({
            ...prev,
            validation: passwordValidationResult
        }))

        if (emailValidationResult.isValid && passwordValidationResult.isValid) {
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
        <ScrollView style={styles.container}>
            <PoppinsText style={styles.welcomeText}>Welcome to</PoppinsText>
            <View style={{ alignItems: 'center' }}>
                <Image
                    source={require('../../assets/icon.png')}
                    style={{ width: 200, height: 200 }}
                />
                <PoppinsText style={{ ...styles.welcomeText, color: mainColor }}>Rescue Wheels</PoppinsText>
            </View>
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
                            color: mainColor,
                            textDecorationLine: 'underline'
                        }}
                        onPress={handleSignUpOnPress}
                    >
                        Sign Up
                    </PoppinsText>
                </View>
            </View>
            <PoppinsText style={styles.label}>Enter your username or E-mail</PoppinsText>
            <CustomTextInput
                autoCapitalize='none'
                Icon={() => <Fontisto
                    name='email'
                    style={{
                        ...styles.icon,
                        color: email.isFocused ?
                            mainColor : email.validation.isValid ? '#ADADAD' : 'red'
                    }}
                />}
                hasValidation={true}
                onBlur={handleEmailTextInputOnBlur}
                onChangeText={e => setEmail(prev => ({ ...prev, value: e }))}
                onFocus={() => setEmail(prev => ({ ...prev, isFocused: true }))}
                placeholder='Username or E-mail'
                state={email}
                keyboardType='email-address'
            />
            <ValidationMessage state={email} />
            <PoppinsText style={styles.label}>Enter your password</PoppinsText>
            <CustomTextInput
                autoCapitalize='none'
                Icon={() => <MaterialIcons
                    name='password'
                    style={{
                        ...styles.icon,
                        color: password.isFocused ?
                            mainColor : password.validation.isValid ? '#ADADAD' : 'red'
                    }}
                />}
                hasValidation={true}
                onBlur={handlePasswordTextInputOnBlur}
                onChangeText={e => setPassword(prev => ({ ...prev, value: e }))}
                onFocus={() => setPassword(prev => ({ ...prev, isFocused: true }))}
                placeholder='Password'
                secureTextEntry={true}
                state={password}
            />
            <ValidationMessage state={password} />
            <PoppinsText
                style={styles.forgotPasswordText}
                onPress={handleForgotPasswordOnPress}
            >
                Forgot password?
            </PoppinsText>
            <TouchableOpacity
                style={{ ...styles.button, backgroundColor: secondryColor }}
                onPress={handleSignInBtn}
            >
                <PoppinsText style={{ ...styles.buttonText, color: mainColor }}>Sign in</PoppinsText>
            </TouchableOpacity>
            <PoppinsText style={styles.orText}>or</PoppinsText>
            <TouchableOpacity
                style={{ ...styles.button, backgroundColor: secondryColor, flexDirection: 'row' }}
                onPress={handleSignInWithGoogleBtn}
            >
                <AntDesign name='google' style={styles.googleIcon} />
                <PoppinsText style={styles.googleText}>Sign in with Google</PoppinsText>
            </TouchableOpacity>
        </ScrollView>
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
    icon: {
        paddingRight: 8,
        fontSize: 20
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
        color: mainColor,
        marginVertical: 8
    },
    googleText: {
        fontSize: 20,
        color: mainColor,
        textAlign: 'center',
        width: '100%'
    }
})