import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useState } from 'react'
import PoppinsText from '../components/PoppinsText'
import BackButton from '../components/BackButton'
import { validateConfirmationPassword, validatePassword } from '../utils/inputValidations';

const ResetPassword = ({ navigation }) => {
    const [password, setPassword] = useState({
        value: "",
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [confirmPassword, setConfirmPassword] = useState({
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
        setConfirmPassword(prev => ({
            ...prev,
            isFocused: false,
            validation: validateConfirmationPassword(password.value, confirmPassword.value)
        }))
    }

    const handleResetPasswordBtn = () => {
        //TODO: Update password
        const passwordValidationResult = validatePassword(password.value)
        const confirmationPasswordResult = validateConfirmationPassword(password.value, confirmPassword.value)

        setPassword(prev => ({
            ...prev,
            validation: passwordValidationResult
        }))

        setConfirmPassword(prev => ({
            ...prev,
            validation: confirmationPasswordResult
        }))

        if (passwordValidationResult.isValid &&
            confirmationPasswordResult.isValid) {
            navigation.popToTop()
        }
    }

    return (
        <View style={styles.container}>
            <BackButton navigation={navigation} />
            <PoppinsText style={styles.welcomeText}>Welcome to <PoppinsText
                style={{ color: '#E48700' }}
            >
                Rescue Wheels
            </PoppinsText>
            </PoppinsText>
            <PoppinsText style={styles.title}>Reset Password</PoppinsText>

            <PoppinsText style={styles.label}>Enter Your New Password</PoppinsText>
            <View style={{
                ...styles.inputView,
                borderColor: password.isFocused ? '#E48700' : password.validation.isValid ? '#ADADAD' : 'red'
            }}>
                <MaterialIcons
                    name='password'
                    style={{
                        ...styles.icon,
                        color: password.isFocused ? '#E48700' : password.validation.isValid ? '#ADADAD' : 'red'
                    }} />
                <TextInput
                    placeholder='Password'
                    secureTextEntry={true}
                    value={password.value}
                    onChangeText={e => setPassword({ ...password, value: e })}
                    style={styles.textInput}
                    placeholderTextColor={'#ADADAD'}
                    onFocus={() => setPassword({ ...password, isFocused: true })}
                    onBlur={handlePasswordTextInputOnBlur}
                />
            </View>
            {
                password.validation.isValid ?
                    null : <PoppinsText style={styles.validationMessageText}>{password.validation.message}</PoppinsText>
            }
            <PoppinsText style={styles.label}>Confirm Your New Password</PoppinsText>
            <View style={{
                ...styles.inputView,
                borderColor: confirmPassword.isFocused ? '#E48700' : confirmPassword.validation.isValid ? '#ADADAD' : 'red'
            }}>
                <MaterialIcons
                    name='password'
                    style={{
                        ...styles.icon,
                        color: confirmPassword.isFocused ? '#E48700' : confirmPassword.validation.isValid ? '#ADADAD' : 'red'
                    }} />
                <TextInput
                    placeholder='Password'
                    secureTextEntry={true}
                    value={confirmPassword.value}
                    onChangeText={e => setConfirmPassword({ ...confirmPassword, value: e })}
                    style={styles.textInput}
                    placeholderTextColor={'#ADADAD'}
                    onFocus={() => setConfirmPassword({ ...confirmPassword, isFocused: true })}
                    onBlur={handleConfirmationPasswordTextInputOnBlur}
                />
            </View>
            {
                confirmPassword.validation.isValid ?
                    null : <PoppinsText style={styles.validationMessageText}>{confirmPassword.validation.message}</PoppinsText>
            }
            <TouchableOpacity
                style={{ ...styles.button, backgroundColor: '#E48700' }}
                onPress={handleResetPasswordBtn}
            >
                <PoppinsText style={{ ...styles.buttonText, color: 'white' }}>Continue</PoppinsText>
            </TouchableOpacity>
        </View>
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
    },
    validationMessageText: {
        color: 'red',
        marginBottom: 16
    }
})