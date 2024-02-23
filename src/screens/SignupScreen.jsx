import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { useMemo, useState } from 'react'
import { Fontisto, MaterialIcons } from '@expo/vector-icons';
import PoppinsText from '../components/PoppinsText'
import DatePicker from '@react-native-community/datetimepicker'
import BackButton from '../components/BackButton';
import { useDispatch } from 'react-redux';
import { signUpAsync } from '../store/userSlice';
import Toast from "react-native-root-toast";

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState({
        value: "",
        isFocused: false
    })
    const [firstName, setFirstName] = useState({
        value: "",
        isFocused: false
    })
    const [lastName, setLastName] = useState({
        value: "",
        isFocused: false
    })
    const [phoneNumber, setPhoneNumber] = useState({
        value: "",
        isFocused: false
    })
    const [password, setPassword] = useState({
        value: "",
        isFocused: false
    })
    const [confirmPassword, setconfirmPassword] = useState({
        value: "",
        isFocused: false
    })
    const [dob, setDob] = useState({
        value: new Date(),
        initValue: true,
    })
    const [showDatePicker, setShowDatePicker] = useState(false)

    const date = useMemo(() => {
        const birthDate = dob.value
        return `${birthDate.getFullYear()}-${birthDate.getMonth() + 1}-${birthDate.getDate()}`
    }, [dob])

    const onChange = (e, selectedDate) => {
        setShowDatePicker(false)
        setDob({
            ...dob, value: selectedDate, initValue: false
        })
    }
    const dispatch = useDispatch()

    const handleSignUpBtn = () => {
        if (confirmPassword.value == password.value) {
            dispatch(signUpAsync({
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                password: password.value,
                mobileNumber: phoneNumber.value,
                DOB: dob.value
            }))
        } else {
            Toast.show('Confirmation password does not match', {
                duration: Toast.durations.LONG
            })
        }
        // navigation.popToTop()
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
                    <PoppinsText style={styles.label}>Enter your First Name</PoppinsText>
                    <View style={{
                        ...styles.inputView,
                        borderColor: firstName.isFocused ? '#E48700' : '#ADADAD'
                    }}>
                        <MaterialIcons
                            name="drive-file-rename-outline"
                            style={{
                                ...styles.icon,
                                color: firstName.isFocused ? '#E48700' : '#ADADAD'
                            }}
                        />
                        <TextInput
                            placeholder='First Name'
                            value={firstName.value}
                            onChangeText={e => setFirstName({ ...firstName, value: e })}
                            style={styles.textInput}
                            placeholderTextColor={'#ADADAD'}
                            onFocus={() => setFirstName({ ...firstName, isFocused: true })}
                            onBlur={() => setFirstName({ ...firstName, isFocused: false })}
                        />
                    </View>
                </View>

                <View style={{ width: "48%" }}>
                    <PoppinsText style={styles.label}>Enter your Last Name</PoppinsText>
                    <View style={{
                        ...styles.inputView,
                        borderColor: lastName.isFocused ? '#E48700' : '#ADADAD'
                    }}>
                        <MaterialIcons name="drive-file-rename-outline"
                            style={{
                                ...styles.icon,
                                color: lastName.isFocused ? '#E48700' : '#ADADAD'
                            }} />
                        <TextInput
                            placeholder='Last Name'
                            value={lastName.value}
                            onChangeText={e => setLastName({ ...lastName, value: e })}
                            style={styles.textInput}
                            placeholderTextColor={'#ADADAD'}
                            onFocus={() => setLastName({ ...lastName, isFocused: true })}
                            onBlur={() => setLastName({ ...lastName, isFocused: false })}
                        />
                    </View>
                </View>
            </View>

            <PoppinsText style={styles.label}>Enter your E-mail</PoppinsText>
            <View
                style={{
                    ...styles.inputView,
                    borderColor: email.isFocused ? '#E48700' : '#ADADAD'
                }}
            >
                <Fontisto
                    name="email"
                    style={{
                        ...styles.icon,
                        color: email.isFocused ? '#E48700' : '#ADADAD'
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
                    onBlur={() => setEmail({ ...email, isFocused: false })}
                />
            </View>
            <PoppinsText style={styles.label}>Enter your password</PoppinsText>
            <View style={{
                ...styles.inputView,
                borderColor: password.isFocused ? '#E48700' : '#ADADAD'
            }}>
                <MaterialIcons
                    name='password'
                    style={{
                        ...styles.icon,
                        color: password.isFocused ? '#E48700' : '#ADADAD'
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
                    onBlur={() => setPassword({ ...password, isFocused: false })}
                />
            </View>
            <PoppinsText style={styles.label}>Confirm your password</PoppinsText>
            <View style={{
                ...styles.inputView,
                borderColor: confirmPassword.isFocused ? '#E48700' : '#ADADAD'
            }}>
                <MaterialIcons
                    name='password'
                    style={{
                        ...styles.icon,
                        color: confirmPassword.isFocused ? '#E48700' : '#ADADAD'
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
                    onBlur={() => setconfirmPassword({ ...confirmPassword, isFocused: false })}
                />
            </View>
            <View style={styles.flexRow}>
                <View style={{ width: "48%", justifyContent: 'space-between' }}>
                    <PoppinsText style={styles.label}>Enter your Phone Number</PoppinsText>
                    <View
                        style={{
                            ...styles.inputView,
                            borderColor: phoneNumber.isFocused ? '#E48700' : '#ADADAD'
                        }}>
                        <MaterialIcons
                            name="local-phone"
                            style={{
                                ...styles.icon,
                                color: phoneNumber.isFocused ? '#E48700' : '#ADADAD'
                            }}
                        />
                        <TextInput
                            placeholder='Phone Number'
                            value={phoneNumber.value}
                            onChangeText={e => setPhoneNumber({ ...phoneNumber, value: e })}
                            style={styles.textInput}
                            placeholderTextColor={'#ADADAD'}
                            onFocus={() => setPhoneNumber({ ...phoneNumber, isFocused: true })}
                            onBlur={() => setPhoneNumber({ ...phoneNumber, isFocused: false })}
                            keyboardType='phone-pad'
                        />
                    </View>
                </View>

                <View style={{ width: "48%", justifyContent: 'space-between' }}>
                    <PoppinsText style={styles.label}>Enter your Birth Date</PoppinsText>
                    <TouchableOpacity
                        style={{
                            ...styles.inputView,
                            borderColor: '#ADADAD',
                        }}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Fontisto
                            name="date"
                            style={{
                                ...styles.icon,
                                color: '#ADADAD'
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
    }
})