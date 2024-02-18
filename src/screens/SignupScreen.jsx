import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import { Fontisto, MaterialIcons } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import PoppinsText from '../components/PoppinsText'


const SignupScreen = () => {

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
    const [dob, setDob] = useState({
        value: new Date(),
        initValue: true,
        isFocused: false
    })

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        dob: { date: new Date(), initValue: true }
    })

    const date = useMemo(() => {
        const birthDate = dob.value
        return `${birthDate.getDate()}/${birthDate.getMonth() + 1}/${birthDate.getFullYear()}`
    }, [dob])

    const onChange = (e, selectedDate) => {
        setDob({
            ...dob, value: selectedDate, initValue: false
        })
    }

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: dob.value,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const handleSignUpBtn = () => {

    }

    const handleSignInOnPress = () => {
        //TODO
    }

    return (
        <View style={styles.container} >
            <PoppinsText style={styles.welcomeText}>Welcome to <PoppinsText
                style={{ color: '#E48700' }}
            >
                Rescue Wheels
            </PoppinsText>
            </PoppinsText>

            <View style={{
                ...styles.flexRow,
                marginVertical: 15
            }}>
                <View>
                    <PoppinsText style={styles.title}>Sign Up</PoppinsText>
                </View>

                <View>
                    <PoppinsText style={styles.label}>Don't have an account?</PoppinsText>
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
                        <MaterialIcons name="drive-file-rename-outline"
                            style={{
                                ...styles.icon,
                                color: firstName.isFocused ? '#E48700' : '#ADADAD'
                            }} />
                        <TextInput
                            placeholder='First Name'
                            value={firstName}
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
                            value={lastName}
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
            <View style={{
                ...styles.inputView,
                borderColor: email.isFocused ? '#E48700' : '#ADADAD'
            }}>
                <Fontisto name="email"
                    style={{
                        ...styles.icon,
                        color: email.isFocused ? '#E48700' : '#ADADAD'
                    }} />
                <TextInput
                    placeholder='E-mail'
                    keyboardType='email-address'
                    value={email}
                    onChangeText={e => setEmail({ ...email, value: e })}
                    style={styles.textInput}
                    placeholderTextColor={'#ADADAD'}
                    onFocus={() => setEmail({ ...email, isFocused: true })}
                    onBlur={() => setEmail({ ...email, isFocused: false })}
                />
            </View>

            <View style={styles.flexRow}>
                <View style={{ width: "48%" }}>
                    <PoppinsText style={styles.label}>Enter your Phone Number</PoppinsText>
                    <View style={{
                        ...styles.inputView,
                        borderColor: phoneNumber.isFocused ? '#E48700' : '#ADADAD'
                    }}>
                        <MaterialIcons name="local-phone"
                            style={{
                                ...styles.icon,
                                color: phoneNumber.isFocused ? '#E48700' : '#ADADAD'
                            }} />
                        <TextInput
                            placeholder='Phone Number'
                            value={phoneNumber}
                            onChangeText={e => setPhoneNumber({ ...phoneNumber, value: e })}
                            style={styles.textInput}
                            placeholderTextColor={'#ADADAD'}
                            onFocus={() => setPhoneNumber({ ...phoneNumber, isFocused: true })}
                            onBlur={() => setPhoneNumber({ ...phoneNumber, isFocused: false })}
                        />
                    </View>
                </View>

                <View style={{ width: "48%" }}>
                    <PoppinsText style={styles.label}>Enter your Birth Date</PoppinsText>
                    <TouchableOpacity style={{
                        ...styles.inputView,
                        borderColor: dob.isFocused ? '#E48700' : '#ADADAD'
                    }} onPress={showDatepicker}>
                        <Fontisto name="date" style={{
                            ...styles.icon,
                            color: dob.isFocused ? '#E48700' : '#ADADAD'
                        }} />
                        <Text style={{
                            ...styles.textInput,
                            color: dob.initValue ? '#ADADAD' : 'black'
                        }}>
                            {
                                dob.initValue ? "birth date" : date
                            }
                        </Text>
                    </TouchableOpacity>
                </View>

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
                    value={password}
                    secureTextEntry={true}
                    onChangeText={e => setPassword({ ...password, value: e })}
                    style={styles.textInput}
                    placeholderTextColor={'#ADADAD'}
                    onFocus={() => setPassword({ ...password, isFocused: true })}
                    onBlur={() => setPassword({ ...password, isFocused: false })}
                />
            </View>
            <TouchableOpacity
                style={{ ...styles.button, backgroundColor: '#E48700' }}
                onPress={handleSignUpBtn}
            >
                <PoppinsText style={{ ...styles.buttonText, color: 'white' }}>Sign Up</PoppinsText>
            </TouchableOpacity>
        </View>
    )
}

export default SignupScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    title: {
        fontSize: 32,
    },
    welcomeView: {
        flexDirection: 'row'
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