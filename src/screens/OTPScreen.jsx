import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import BackButton from '../components/BackButton'
import PoppinsText from '../components/PoppinsText'
import CustomTextInput from '../components/CustomTextInput'
import ValidationMessage from '../components/ValidationMessage'
import { useState } from 'react'
import { mainColor, secondryColor } from '../colors'
import { MaterialIcons } from '@expo/vector-icons'
import { validateOTP } from '../utils/inputValidations'
import { verifyOtp } from '../api/user'
import showToast, { SMTH_WENT_WRONG } from '../components/Toast'

const OTPScreen = ({ navigation, route }) => {
    const { email } = route.params
    const [otp, setOtp] = useState({
        value: "",
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })

    const handleVerifyBtn = async () => {
        try {
            const otpVerificationResult = validateOTP(otp.value)

            setOtp(prev => ({ ...prev, validation: otpVerificationResult }))

            if (otpVerificationResult.isValid) {
                const response = await verifyOtp(otp.value, email)

                if (response.status === 200) {
                    navigation.navigate('Reset password', { email })
                }
            }
        } catch (err) {
            console.log(err);
            showToast(SMTH_WENT_WRONG)
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
            <PoppinsText style={styles.label}>Please enter your registered email address, so we will send you an OTP</PoppinsText>
            <PoppinsText>Enter OTP</PoppinsText>
            <CustomTextInput
                Icon={() => <MaterialIcons
                    name='password'
                    style={{
                        ...styles.icon,
                        color: otp.isFocused ?
                            mainColor : otp.validation.isValid ? '#ADADAD' : 'red'
                    }}
                />}
                keyboardType={'numeric'}
                onChangeText={e => setOtp(prev => ({ ...prev, value: e }))}
                onBlur={() => setOtp(prev => ({ ...prev, isFocused: false, validation: validateOTP(otp.value) }))}
                onFocus={() => setOtp(prev => ({ ...prev, isFocused: true }))}
                placeholder={'OTP'}
                state={otp}
                hasValidation={true}
            />
            <ValidationMessage state={otp} />
            <TouchableOpacity
                style={{ ...styles.button, backgroundColor: secondryColor }}
                onPress={handleVerifyBtn}
            >
                <PoppinsText style={{ ...styles.buttonText, color: mainColor }}>Verify</PoppinsText>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default OTPScreen

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