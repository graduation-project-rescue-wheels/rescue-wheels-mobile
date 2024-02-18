import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { Fontisto, Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import PoppinsText from '../components/PoppinsText'
import BackButton from '../components/BackButton'

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState({
        value: "",
        isFocused: false
    })

    const handleForgotPassowrdBtn = () => {
        //TODO: Send E-mail
        navigation.navigate('Reset password')
    }

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation}/>
            <PoppinsText style={styles.welcomeText}>Welcome to <PoppinsText
                style={{ color: '#E48700' }}
            >
                Rescue Wheels
            </PoppinsText>
            </PoppinsText>
            <PoppinsText style={styles.title}>Forgot Password</PoppinsText>
            <PoppinsText style={styles.label}>Please enter your registered email address, so we will send you link to your email</PoppinsText>
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
                    placeholder='E-mail'
                    keyboardType='email-address'
                    value={email.value}
                    onChangeText={e => setEmail({ ...email, value: e })}
                    style={styles.textInput}
                    placeholderTextColor={'#ADADAD'}
                    onFocus={() => setEmail({ ...email, isFocused: true })}
                    onBlur={() => setEmail({ ...email, isFocused: false })}
                />
            </View>

            <TouchableOpacity
                style={{ ...styles.button, backgroundColor: '#E48700' }}
                onPress={handleForgotPassowrdBtn}
            >
                <PoppinsText style={{ ...styles.buttonText, color: 'white' }}>Send</PoppinsText>
            </TouchableOpacity>
        </View>
    )
}

export default ForgotPassword

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
    label: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 70
    }
})