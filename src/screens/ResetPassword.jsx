import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useState } from 'react'
import PoppinsText from '../components/PoppinsText'
import BackButton from '../components/BackButton'
import { mainColor, secondryColor } from '../colors'
import CustomTextInput from '../components/CustomTextInput'
import ValidationMessage from '../components/ValidationMessage'
import { validateConfirmationPassword, validatePassword } from '../utils/inputValidations'
import showToast, { SMTH_WENT_WRONG } from '../components/Toast'
import { changePassword } from '../api/user'

const ResetPassword = ({ navigation, route }) => {
    const { email } = route.params
    const [password, setPassword] = useState({
        value: "",
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [confirmPassword, setconfirmPassword] = useState({
        value: "",
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })

    const handlePasswordTextInputOnBlur = () => {
        setPassword(prev => ({
            ...prev,
            isFocused: false,
            validation: validatePassword(password.value)
        }))
    }

    const handleConfirmationPasswordTextInputOnBlur = () => {
        setconfirmPassword(prev => ({
            ...prev,
            isFocused: false,
            validation: validateConfirmationPassword(password.value, confirmPassword.value)
        }))
    }

    const handleResetPasswordBtn = async () => {
        try {
            const passwordValidationResult = validatePassword(password.value)
            const confirmationPasswordResult = validateConfirmationPassword(password.value, confirmPassword.value)

            setPassword({ ...password, validation: passwordValidationResult })
            setconfirmPassword({ ...password, validation: confirmationPasswordResult })

            if (passwordValidationResult.isValid && confirmationPasswordResult.isValid) {
                const response = await changePassword(email, password.value, confirmPassword.value)

                if (response.status === 200) {
                    navigation.popToTop()
                    showToast('Password updated!')
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
            <PoppinsText style={styles.title}>Reset Password</PoppinsText>

            <PoppinsText style={styles.label}>Enter Your New Password</PoppinsText>
            <CustomTextInput
                Icon={() => <MaterialIcons
                    name='password'
                    style={{
                        ...styles.icon,
                        color: password.isFocused ? mainColor : password.validation.isValid ? '#ADADAD' : 'red'
                    }}
                />}
                hasValidation={true}
                onBlur={handlePasswordTextInputOnBlur}
                onChangeText={e => setPassword({ ...password, value: e })}
                onFocus={() => setPassword({ ...password, isFocused: true })}
                placeholder='Password'
                secureTextEntry={true}
                state={password}
            />
            <ValidationMessage state={password} />
            <PoppinsText style={styles.label}>Confirm Your New Password</PoppinsText>
            <CustomTextInput
                Icon={() => <MaterialIcons
                    name='password'
                    style={{
                        ...styles.icon,
                        color: confirmPassword.isFocused ? mainColor : confirmPassword.validation.isValid ? '#ADADAD' : 'red'
                    }}
                />}
                hasValidation={true}
                onBlur={handleConfirmationPasswordTextInputOnBlur}
                onChangeText={e => setconfirmPassword({ ...confirmPassword, value: e })}
                onFocus={() => setconfirmPassword({ ...confirmPassword, isFocused: true })}
                placeholder='Confirm Password'
                secureTextEntry={true}
                state={confirmPassword}
            />
            <ValidationMessage state={confirmPassword} />
            <TouchableOpacity
                style={{ ...styles.button, backgroundColor: secondryColor }}
                onPress={handleResetPasswordBtn}
            >
                <PoppinsText style={{ ...styles.buttonText, color: mainColor }}>Continue</PoppinsText>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default ResetPassword

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
        fontSize: 16,
    }
})