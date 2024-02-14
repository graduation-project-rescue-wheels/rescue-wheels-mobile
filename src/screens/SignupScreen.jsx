import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import { AntDesign, Fontisto, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';


const SignupScreen = () => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        dob: { date: new Date(), initValue: true }
    })

    const date = useMemo(() => {
        const birthDate = user.dob.date
        return `${birthDate.getDate()}/${birthDate.getMonth() + 1}/${birthDate.getFullYear()}`
    }, [user.dob])

    const onChange = (e, selectedDate) => {
        setUser({ ...user, dob: { date: selectedDate, initValue: false } })
    }

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: user.dob.date,
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

    return (
        <View style={styles.container} >
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
                <Text style={styles.title}>Sign Up</Text>
                <View style={styles.userNameInput}>
                    <View style={{ ...styles.inputView, marginRight: 8, flex: 1 }}>
                        <AntDesign style={styles.icon} name="user" />
                        <TextInput
                            placeholder='First name'
                            value={user.firstName}
                            onChangeText={e => setUser({ ...user, firstName: e })}
                            style={styles.textInput}
                            placeholderTextColor={'white'}
                        />
                    </View>
                    <View style={{ ...styles.inputView, marginLeft: 8, flex: 1 }}>
                        <AntDesign style={styles.icon} name="user" />
                        <TextInput
                            placeholder='Last name'
                            value={user.lastName}
                            onChangeText={e => setUser({ ...user, lastName: e })}
                            style={styles.textInput}
                            placeholderTextColor={'white'}
                        />
                    </View>
                </View>
                <View style={styles.inputView}>
                    <Fontisto name='email' style={styles.icon} />
                    <TextInput
                        placeholder='Enter your email name'
                        keyboardType='email-address'
                        value={user.email}
                        onChangeText={e => setUser({ ...user, email: e })}
                        style={styles.textInput}
                        placeholderTextColor={'white'}
                    />
                </View>
                <View style={styles.inputView}>
                    <MaterialIcons name='password' style={styles.icon} />
                    <TextInput
                        placeholder='Enter your password'
                        secureTextEntry={true}
                        value={user.password}
                        onChangeText={e => setUser({ ...user, password: e })}
                        style={styles.textInput}
                        placeholderTextColor={'white'}
                    />
                </View>
                <View style={styles.inputView}>
                    <MaterialIcons name='password' style={styles.icon} />
                    <TextInput
                        placeholder='Confirm your passord'
                        secureTextEntry={true}
                        value={user.confirmPassword}
                        onChangeText={e => setUser({ ...user, confirmPassword: e })}
                        style={styles.textInput}
                        placeholderTextColor={'white'}
                    />
                </View>
                <View style={styles.inputView}>
                    <AntDesign name="phone" style={styles.icon} />
                    <TextInput
                        placeholder='Enter your phone number'
                        keyboardType='phone-pad'
                        value={user.phoneNumber}
                        onChangeText={e => setUser({ ...user, phoneNumber: e })}
                        style={styles.textInput}
                        placeholderTextColor={'white'}
                    />
                </View>
                <TouchableOpacity style={styles.inputView} onPress={showDatepicker}>
                    <Fontisto name="date" style={styles.icon} />
                    <Text style={styles.textInput}>
                        {
                            user.dob.initValue ? "Pick your birth date" : date
                        }
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ ...styles.button, backgroundColor: '#5381ff' }}
                    onPress={handleSignUpBtn}
                >
                    <Text style={{ ...styles.buttonText, color: 'white' }}>Sign Up</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    )
}

export default SignupScreen

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
    userNameInput: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
    },
    inputView: {
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
        flex: 1,
        color: 'white'
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
    button: {
        marginVertical: 16,
        padding: 8,
        borderRadius: 16
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 20
    },

})