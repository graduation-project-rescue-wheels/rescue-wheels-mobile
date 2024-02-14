import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Fontisto, MaterialIcons } from '@expo/vector-icons'
import { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'

const LoginScreen = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSignInBtn = () => {
        //TODO
    }

    const handleForgotPassword = () => {
        //TODO
    }

    const handleSignUpBtn = () => {
        //TODO
    }

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/car-towing.png')}
                style={styles.image}
                resizeMode='contain'
            />
            <LinearGradient
                colors={['white', 'rgba(255, 255, 255, 0)']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 0.6 }}
            >
                <Text style={styles.title}>Rescue Wheels</Text>
                <Text style={styles.welcomeText}>Please enter your credentials:</Text>
                <View style={styles.inputView}>
                    <Fontisto name='email' style={styles.icon} />
                    <TextInput
                        placeholder='Enter your E-mail'
                        keyboardType='email-address'
                        value={email}
                        onChangeText={e => setEmail(e)}
                        style={styles.textInput}
                        placeholderTextColor={'white'}
                    />
                </View>
                <View style={styles.inputView}>
                    <MaterialIcons name='password' style={styles.icon} />
                    <TextInput
                        placeholder='Enter your password'
                        secureTextEntry={true}
                        value={password}
                        onChangeText={e => setPassword(e)}
                        style={styles.textInput}
                        placeholderTextColor={'white'}
                    />
                </View>
                <Text
                    style={styles.forgotPasswordText}
                    onPress={handleForgotPassword}
                >
                    Forgot password?
                </Text>
                <TouchableOpacity
                    style={{ ...styles.button, backgroundColor: '#5381ff' }}
                    onPress={handleSignInBtn}
                >
                    <Text style={{ ...styles.buttonText, color: 'white' }}>Sign in</Text>
                </TouchableOpacity>
                <Text style={styles.signUpText}>Don't have an account?</Text>
                <TouchableOpacity
                    style={{ ...styles.button, backgroundColor: 'white' }}
                    onPress={handleSignUpBtn}
                >
                    <Text style={{ ...styles.buttonText, color: '#5381ff' }}>Sign up</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    title: {
        textAlign: 'center',
        fontSize: 32,
        color: '#5381ff',
        fontWeight: 'bold'
    },
    welcomeText: {
        paddingTop: 16,
        fontSize: 20
    },
    inputView: {
        width: '100%',
        borderWidth: 1,
        marginTop: 16,
        borderRadius: 16,
        borderColor: 'white',
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        paddingRight: 8,
        fontSize: 20,
        color: '#5381ff'
    },
    textInput: {
        paddingVertical: 4,
        flex: 1
    },
    button: {
        marginVertical: 16,
        padding: 8,
        borderRadius: 16
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 20
    },
    signUpText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center'
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
        color: 'white',
        fontSize: 16,
        marginTop: 16
    }
})