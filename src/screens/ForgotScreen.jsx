import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Fontisto } from '@expo/vector-icons'
import { useState } from 'react'
import PoppinsText from '../components/PoppinsText'
import BackButton from '../components/BackButton'
import CustomTextInput from '../components/CustomTextInput'
import { mainColor, secondryColor } from '../colors'
import { validateEmail } from '../utils/inputValidations'
import ValidationMessage from '../components/ValidationMessage'

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState({
        value: "",
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })

    const handleForgotPassowrdBtn = () => {
        const emailValidationResult = validateEmail(email.value)

        setEmail({ ...email, validation: emailValidationResult })

        if (emailValidationResult.isValid) {
            //TODO: Send E-mail
            navigation.navigate('Reset password')
        }
    }

    return (
        <ScrollView style={styles.container}>
            <BackButton navigation={navigation} />
            <PoppinsText style={styles.welcomeText}>Welcome to</PoppinsText>
            <View style={{ alignItems: 'center' }}>
                <Image
                    source={require('../../assets/icon.png')}
                    style={{ width: 200, height: 200 }}
                />
                <PoppinsText style={{ ...styles.welcomeText, color: mainColor }}>Rescue Wheels</PoppinsText>
            </View>
            <PoppinsText style={styles.title}>Forgot Password</PoppinsText>
            <PoppinsText style={styles.label}>Please enter your registered email address, so we will send you link to your email</PoppinsText>
            <CustomTextInput
                Icon={() => <Fontisto
                    name='email'
                    style={{
                        ...styles.icon,
                        color: email.isFocused ?
                            mainColor : email.validation.isValid ? '#ADADAD' : 'red'
                    }}
                />}
                autoCapitalize='none'
                keyboardType={'email-address'}
                onBlur={() => {
                    setEmail({ ...email, isFocused: false, validation: validateEmail(email.value) })
                }}
                onChangeText={e => setEmail({ ...email, value: e })}
                onFocus={() => setEmail({ ...email, isFocused: true })}
                placeholder='E-mail'
                state={email}
                hasValidation={true}
            />
            <ValidationMessage state={email} />
            <TouchableOpacity
                style={{ ...styles.button, backgroundColor: secondryColor }}
                onPress={handleForgotPassowrdBtn}
            >
                <PoppinsText style={{ ...styles.buttonText, color: mainColor }}>Send</PoppinsText>
            </TouchableOpacity>
        </ScrollView>
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