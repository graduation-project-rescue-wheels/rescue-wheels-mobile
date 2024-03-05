import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { useMemo, useState } from 'react'
import { Fontisto, MaterialIcons } from '@expo/vector-icons';
import PoppinsText from '../components/PoppinsText'
import DatePicker from '@react-native-community/datetimepicker'
import BackButton from '../components/BackButton';
import { useDispatch } from 'react-redux';
import { signUpAsync } from '../store/userSlice';
import { validateConfirmationPassword, validateEmail, validateFirstName, validateLastName, validatePassword, validatePhoneNumber, validatedob } from '../utils/inputValidations';

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
    const [dob, setDob] = useState({
        value: new Date(),
        initValue: true,
        validation: {
            isValid: true,
            message: ''
        }
    })

    const [showDatePicker, setShowDatePicker] = useState(false)

    const date = useMemo(() => {
        const birthDate = dob.value
        return `${birthDate.getFullYear()}-${birthDate.getMonth() + 1}-${birthDate.getDate()}`
    }, [dob])

    const onChange = (e, selectedDate) => {
        setShowDatePicker(false)
        setDob({
            ...dob,
            value: selectedDate,
            initValue: false,
            validation: validatedob(false)
        })
    }

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
        const dobResult = validatedob(dob.initValue)

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

        setDob(prev => ({
            ...prev,
            validation: dobResult
        }))

        if (emailValidationResult.isValid &&
            passwordValidationResult.isValid &&
            confirmationPasswordResult.isValid &&
            firstNameResult.isValid &&
            lastNameResult.isValid &&
            phoneNumberResult.isValid &&
            dobResult.isValid) {

            dispatch(signUpAsync({
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                password: password.value,
                mobileNumber: phoneNumber.value,
                DOB: dob.value,
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
                style={{ color: '#E48700' }}
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
                            color: '#E48700'
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
                    <View style={{
                        ...styles.inputView,
                        borderColor: firstName.isFocused ? '#E48700' : firstName.validation.isValid ? '#ADADAD' : 'red'
                    }}>
                        <MaterialIcons
                            name="drive-file-rename-outline"
                            style={{
                                ...styles.icon,
                                color: firstName.isFocused ? '#E48700' : firstName.validation.isValid ? '#ADADAD' : 'red'
                            }}
                        />
                        <TextInput
                            placeholder='First Name'
                            value={firstName.value}
                            onChangeText={e => setFirstName({ ...firstName, value: e })}
                            style={styles.textInput}
                            placeholderTextColor={'#ADADAD'}
                            onFocus={() => setFirstName({ ...firstName, isFocused: true })}
                            onBlur={handleFirstNameTextInputOnBlur}
                        />
                    </View>
                    {
                        firstName.validation.isValid ?
                            null : <PoppinsText style={styles.validationMessageText}>{firstName.validation.message}</PoppinsText>
                    }
                </View>

                <View style={{ width: "48%" }}>
                    <PoppinsText style={styles.label}>Enter your last name</PoppinsText>
                    <View style={{
                        ...styles.inputView,
                        borderColor: lastName.isFocused ? '#E48700' : lastName.validation.isValid ? '#ADADAD' : 'red'
                    }}>
                        <MaterialIcons name="drive-file-rename-outline"
                            style={{
                                ...styles.icon,
                                color: lastName.isFocused ? '#E48700' : lastName.validation.isValid ? '#ADADAD' : 'red'
                            }} />
                        <TextInput
                            placeholder='Last Name'
                            value={lastName.value}
                            onChangeText={e => setLastName({ ...lastName, value: e })}
                            style={styles.textInput}
                            placeholderTextColor={'#ADADAD'}
                            onFocus={() => setLastName({ ...lastName, isFocused: true })}
                            onBlur={handleLastNameTextInputOnBlur}
                        />
                    </View>
                    {
                        lastName.validation.isValid ?
                            null : <PoppinsText style={styles.validationMessageText}>{lastName.validation.message}</PoppinsText>
                    }
                </View>
            </View>

            <PoppinsText style={styles.label}>Enter your e-mail</PoppinsText>
            <View
                style={{
                    ...styles.inputView,
                    borderColor: email.isFocused ? '#E48700' : email.validation.isValid ? '#ADADAD' : 'red'
                }}
            >
                <Fontisto
                    name="email"
                    style={{
                        ...styles.icon,
                        color: email.isFocused ? '#E48700' : email.validation.isValid ? '#ADADAD' : 'red'
                    }}
                />
                <TextInput
                    placeholder='E-mail'
                    keyboardType='email-address'
                    value={email.value}
                    onChangeText={e => setEmail({ ...email, value: e })}
                    style={styles.textInput}
                    placeholderTextColor={'#ADADAD'}
                    onFocus={() => setEmail({ ...email, isFocused: true })}
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
                borderColor: password.isFocused ? '#E48700' : password.validation.isValid ? '#ADADAD' : 'red'
            }}>
                <MaterialIcons
                    name='password'
                    style={{
                        ...styles.icon,
                        color: password.isFocused ? '#E48700' : password.validation.isValid ? '#ADADAD' : 'red'
                    }}
                />
                <TextInput
                    placeholder='Password'
                    value={password.value}
                    secureTextEntry={true}
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
            <PoppinsText style={styles.label}>Confirm your password</PoppinsText>
            <View style={{
                ...styles.inputView,
                borderColor: confirmPassword.isFocused ? '#E48700' : confirmPassword.validation.isValid ? '#ADADAD' : 'red'
            }}>
                <MaterialIcons
                    name='password'
                    style={{
                        ...styles.icon,
                        color: confirmPassword.isFocused ? '#E48700' : confirmPassword.validation.isValid ? '#ADADAD' : 'red'
                    }}
                />
                <TextInput
                    placeholder='Confirm Password'
                    value={confirmPassword.value}
                    secureTextEntry={true}
                    onChangeText={e => setconfirmPassword({ ...confirmPassword, value: e })}
                    style={styles.textInput}
                    placeholderTextColor={'#ADADAD'}
                    onFocus={() => setconfirmPassword({ ...confirmPassword, isFocused: true })}
                    onBlur={handleConfirmationPasswordTextInputOnBlur}
                />
            </View>
            {
                confirmPassword.validation.isValid ?
                    null : <PoppinsText style={styles.validationMessageText}>{confirmPassword.validation.message}</PoppinsText>
            }
            <View style={styles.flexRow}>
                <View style={{ width: "48%", justifyContent: 'space-between' }}>
                    <PoppinsText style={styles.label}>Enter your phone number</PoppinsText>
                    <View
                        style={{
                            ...styles.inputView,
                            borderColor: phoneNumber.isFocused ? '#E48700' : phoneNumber.validation.isValid ? '#ADADAD' : 'red'
                        }}>
                        <MaterialIcons
                            name="local-phone"
                            style={{
                                ...styles.icon,
                                color: phoneNumber.isFocused ? '#E48700' : phoneNumber.validation.isValid ? '#ADADAD' : 'red'
                            }}
                        />
                        <TextInput
                            placeholder='Phone Number'
                            value={phoneNumber.value}
                            onChangeText={e => setPhoneNumber({ ...phoneNumber, value: e })}
                            style={styles.textInput}
                            placeholderTextColor={'#ADADAD'}
                            onFocus={() => setPhoneNumber({ ...phoneNumber, isFocused: true })}
                            onBlur={handlePhoneNumberTextInputOnBlur}
                            keyboardType='phone-pad'
                        />
                    </View>
                    {
                        phoneNumber.validation.isValid ?
                            null : <PoppinsText style={styles.validationMessageText}>{phoneNumber.validation.message}</PoppinsText>
                    }
                </View>
                <View style={{ width: "48%", justifyContent: 'space-between' }}>
                    <PoppinsText style={styles.label}>Enter your birth date</PoppinsText>
                    <TouchableOpacity
                        style={{
                            ...styles.inputView,
                            borderColor: dob.validation.isValid ? '#ADADAD' : 'red'
                        }}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Fontisto
                            name="date"
                            style={{
                                ...styles.icon,
                                color: dob.validation.isValid ? '#ADADAD' : 'red'
                            }}
                        />
                        <PoppinsText style={{
                            ...styles.textInput,
                            color: dob.initValue ? '#ADADAD' : 'black'
                        }}>
                            {
                                dob.initValue ? "birth date" : date
                            }
                        </PoppinsText>
                    </TouchableOpacity>
                    {
                        dob.validation.isValid ?
                            null : <PoppinsText style={styles.validationMessageText}>{dob.validation.message}</PoppinsText>
                    }
                </View>
            </View>
            <TouchableOpacity
                style={{ ...styles.button, backgroundColor: '#E48700' }}
                onPress={handleSignUpBtn}
            >
                <PoppinsText style={{ ...styles.buttonText, color: 'white' }}>Sign Up</PoppinsText>
            </TouchableOpacity>
            {
                showDatePicker &&
                <DatePicker
                    value={dob.value}
                    mode='date'
                    onChange={onChange}
                />
            }
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
    inputView: {
        width: '100%',
        borderWidth: 1,
        marginVertical: 16,
        borderRadius: 16,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    icon: {
        paddingRight: 8,
        fontSize: 20
    },
    textInput: {
        width: '100%',
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
        fontSize: 20
    },
    label: {
        fontSize: 14
    },
    validationMessageText: {
        color: 'red',
        marginBottom: 16
    }
})