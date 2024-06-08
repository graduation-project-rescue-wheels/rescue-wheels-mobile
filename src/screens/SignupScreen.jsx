import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useState } from 'react'
import { Fontisto, MaterialIcons } from '@expo/vector-icons';
import PoppinsText from '../components/PoppinsText'
import BackButton from '../components/BackButton';
import { useDispatch } from 'react-redux';
import { validateConfirmationPassword, validateEmail, validateFirstName, validateLastName, validatePassword, validatePhoneNumber } from '../utils/inputValidations';
import CustomTextInput from '../components/CustomTextInput';
import ValidationMessage from '../components/ValidationMessage';
import { signUpAsync } from '../store/userAsyncThunks';
import { mainColor, secondryColor } from '../colors';

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState({
        value: "",
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [firstName, setFirstName] = useState({
        value: "",
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [lastName, setLastName] = useState({
        value: "",
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [phoneNumber, setPhoneNumber] = useState({
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
    const [confirmPassword, setconfirmPassword] = useState({
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

    const handleConfirmationPasswordTextInputOnBlur = () => {
        setconfirmPassword(prev => ({
            ...prev,
            isFocused: false,
            validation: validateConfirmationPassword(password.value, confirmPassword.value)
        }))
    }

    const handlePhoneNumberTextInputOnBlur = () => {
        setPhoneNumber(prev => ({
            ...prev,
            isFocused: false,
            validation: validatePhoneNumber(phoneNumber.value)
        }))
    }

    const handleFirstNameTextInputOnBlur = () => {
        setFirstName(prev => ({
            ...prev,
            isFocused: false,
            validation: validateFirstName(firstName.value)
        }))
    }

    const handleLastNameTextInputOnBlur = () => {
        setLastName(prev => ({
            ...prev,
            isFocused: false,
            validation: validateLastName(lastName.value)
        }))
    }

    const handleSignUpBtn = () => {
        const emailValidationResult = validateEmail(email.value)
        const passwordValidationResult = validatePassword(password.value)
        const confirmationPasswordResult = validateConfirmationPassword(password.value, confirmPassword.value)
        const firstNameResult = validateFirstName(firstName.value)
        const lastNameResult = validateLastName(lastName.value)
        const phoneNumberResult = validatePhoneNumber(phoneNumber.value)

        setEmail(prev => ({
            ...prev,
            validation: emailValidationResult
        }))

        setPassword(prev => ({
            ...prev,
            validation: passwordValidationResult
        }))

        setconfirmPassword(prev => ({
            ...prev,
            validation: confirmationPasswordResult
        }))

        setFirstName(prev => ({
            ...prev,
            validation: firstNameResult
        }))

        setLastName(prev => ({
            ...prev,
            validation: lastNameResult
        }))

        setPhoneNumber(prev => ({
            ...prev,
            validation: phoneNumberResult
        }))

        if (emailValidationResult.isValid &&
            passwordValidationResult.isValid &&
            confirmationPasswordResult.isValid &&
            firstNameResult.isValid &&
            lastNameResult.isValid &&
            phoneNumberResult.isValid) {

            dispatch(signUpAsync({
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                password: password.value,
                mobileNumber: phoneNumber.value,
                navigation
            }))
        }
    }

    const handleSignInOnPress = () => {
        navigation.popToTop()
    }

    return (
        <ScrollView style={styles.container}>
            <BackButton navigation={navigation} />
            <PoppinsText style={styles.welcomeText}>Welcome to <PoppinsText
                style={{ color: mainColor }}
            >
                Rescue Wheels
            </PoppinsText>
            </PoppinsText>

            <View style={{
                ...styles.flexRow,
                marginVertical: 8
            }}>
                <PoppinsText style={styles.title}>Sign Up</PoppinsText>

                <View>
                    <PoppinsText style={styles.label}>Already have an account?</PoppinsText>
                    <PoppinsText
                        style={{
                            color: mainColor,
                            textDecorationLine: 'underline'
                        }}
                        onPress={handleSignInOnPress}
                    >
                        Sign In
                    </PoppinsText>
                </View>
            </View>

            <View style={styles.flexRow}>
                <View style={{ width: "48%" }}>
                    <PoppinsText style={styles.label}>Enter your first name</PoppinsText>
                    <CustomTextInput
                        Icon={() => <MaterialIcons
                            name="drive-file-rename-outline"
                            style={{
                                ...styles.icon,
                                color: firstName.isFocused ? mainColor : firstName.validation.isValid ? '#ADADAD' : 'red'
                            }}
                        />}
                        hasValidation={true}
                        onBlur={handleFirstNameTextInputOnBlur}
                        onChangeText={e => setFirstName({ ...firstName, value: e })}
                        onFocus={() => setFirstName({ ...firstName, isFocused: true })}
                        placeholder='First Name'
                        state={firstName}
                    />
                    <ValidationMessage state={firstName} />
                </View>

                <View style={{ width: "48%" }}>
                    <PoppinsText style={styles.label}>Enter your last name</PoppinsText>
                    <CustomTextInput
                        Icon={() => <MaterialIcons name="drive-file-rename-outline"
                            style={{
                                ...styles.icon,
                                color: lastName.isFocused ? mainColor : lastName.validation.isValid ? '#ADADAD' : 'red'
                            }}
                        />}
                        hasValidation={true}
                        onBlur={handleLastNameTextInputOnBlur}
                        onChangeText={e => setLastName({ ...lastName, value: e })}
                        onFocus={() => setLastName({ ...lastName, isFocused: true })}
                        placeholder='Last Name'
                        state={lastName}
                    />
                    <ValidationMessage state={lastName} />
                </View>
            </View>

            <PoppinsText style={styles.label}>Enter your e-mail</PoppinsText>
            <CustomTextInput
                Icon={() => <Fontisto
                    name="email"
                    style={{
                        ...styles.icon,
                        color: email.isFocused ? mainColor : email.validation.isValid ? '#ADADAD' : 'red'
                    }}
                />}
                hasValidation={true}
                keyboardType='email-address'
                onBlur={handleEmailTextInputOnBlur}
                onChangeText={e => setEmail({ ...email, value: e })}
                onFocus={() => setEmail({ ...email, isFocused: true })}
                placeholder='E-mail'
                state={email}
            />
            <ValidationMessage state={email} />
            <PoppinsText style={styles.label}>Enter your password</PoppinsText>
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
            <PoppinsText style={styles.label}>Confirm your password</PoppinsText>
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
            <PoppinsText style={styles.label}>Enter your phone number</PoppinsText>
            <CustomTextInput
                Icon={() => <MaterialIcons
                    name="local-phone"
                    style={{
                        ...styles.icon,
                        color: phoneNumber.isFocused ? mainColor : phoneNumber.validation.isValid ? '#ADADAD' : 'red'
                    }}
                />}
                hasValidation={true}
                placeholder='Phone Number'
                onChangeText={e => setPhoneNumber({ ...phoneNumber, value: e })}
                onFocus={() => setPhoneNumber({ ...phoneNumber, isFocused: true })}
                onBlur={handlePhoneNumberTextInputOnBlur}
                keyboardType='phone-pad'
                state={phoneNumber}
            />
            <ValidationMessage state={phoneNumber} />
            <TouchableOpacity
                style={{ ...styles.button, backgroundColor: secondryColor }}
                onPress={handleSignUpBtn}
            >
                <PoppinsText style={{ ...styles.buttonText, color: mainColor }}>Sign Up</PoppinsText>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default SignupScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
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
        fontSize: 20
    },
    label: {
        fontSize: 14
    }
})