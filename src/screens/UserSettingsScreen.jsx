import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import { Ionicons } from "@expo/vector-icons"
import PoppinsText from '../components/PoppinsText'
import { AntDesign } from '@expo/vector-icons'
import * as Picker from 'expo-image-picker'
import { useState } from 'react'
import CustomModal from '../components/CustomModal'
import EditableText from '../components/EditableText'
import { MaterialIcons } from '@expo/vector-icons'
import { validateFirstName, validateLastName, validatePhoneNumber } from '../utils/inputValidations'

const UserSettingsScreen = ({ navigation }) => {
    const { user } = useSelector(state => state.user)
    const [image, setImage] = useState(null)
    const [confirmPhotoModalVisible, setConfirmPhotoModalVisible] = useState(false)
    const [firstName, setFirstName] = useState({
        value: user.firstName,
        editable: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [lastName, setLastName] = useState({
        value: user.lastName,
        editable: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [mobileNumber, setMobileNumber] = useState({
        value: user.mobileNumber,
        editable: false,
        validation: {
            isValid: true,
            message: ''
        }
    })

    const pickImage = async () => {
        let result = await Picker.launchImageLibraryAsync({
            mediaTypes: Picker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            allowsMultipleSelection: false
        })

        if (!result.canceled) {
            setImage(result.assets[0].uri)
            setConfirmPhotoModalVisible(true)
        }
    }

    const handleFistNameTextInputOnBlur = () => {
        setFirstName(prev => ({
            ...prev,
            validation: validateFirstName(firstName.value)
        }))
    }

    const handleLastNameTextInputOnBlur = () => {
        setLastName(prev => ({
            ...prev,
            validation: validateLastName(lastName.value)
        }))
    }

    const handleMobileNumberTextInputOnBlur = () => {
        setMobileNumber(prev => ({
            ...prev,
            validation: validatePhoneNumber(mobileNumber.value)
        }))
    }

    return (
        <View style={styles.container}>
            <CustomModal
                visible={confirmPhotoModalVisible}
                onRequestClose={() => {
                    setConfirmPhotoModalVisible(false)
                    setImage(null)
                }}
            >
                <PoppinsText style={styles.modalTitle}>Would you like to set the following photo as your profile photo?</PoppinsText>
                {
                    image !== null && <Image
                        style={styles.imageModal}
                        source={{ uri: image }}
                    />
                }
                <View style={styles.modalBtnsView}>
                    <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={() => {
                            setConfirmPhotoModalVisible(false)
                            setImage(null)
                        }}
                    >
                        <PoppinsText style={{ color: 'red' }}>No</PoppinsText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={() => {
                            //TODO
                        }}
                    >
                        <PoppinsText style={{ color: 'green' }}>Yes</PoppinsText>
                    </TouchableOpacity>
                </View>
            </CustomModal>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ ...styles.flexRow, justifyContent: 'flex-start', alignItems: 'center' }}>
                    {
                        user.photoURL === undefined ?
                            <Ionicons
                                name='person-circle-outline'
                                style={styles.profileIcon}
                            /> : <Image
                                source={{ uri: user.photoURL }}
                                style={styles.profilePhoto}
                                resizeMode='contain'
                            />
                    }
                    <PoppinsText style={{ fontSize: 18 }}>{user.email}</PoppinsText>
                </View>
                <TouchableOpacity
                    style={styles.editProfilePhotoBtn}
                    onPress={pickImage}
                >
                    <AntDesign name='edit' style={styles.icon} />
                </TouchableOpacity>
                <View style={styles.flexRow}>
                    <View style={styles.columnView}>
                        <PoppinsText style={styles.title}>First name</PoppinsText>
                        <EditableText
                            placeholder='First name'
                            state={firstName}
                            keyboardType={'default'}
                            onChangeText={e => setFirstName(prev => ({ ...prev, value: e }))}
                            Icon={() => <MaterialIcons name='drive-file-rename-outline' style={styles.EditableTextIcon} />}
                            setState={setFirstName}
                            onBlur={handleFistNameTextInputOnBlur}
                        />
                    </View>
                    <View style={styles.columnView}>
                        <PoppinsText style={styles.title}>Last name</PoppinsText>
                        <EditableText
                            placeholder='Last name'
                            state={lastName}
                            keyboardType={'default'}
                            onChangeText={e => setLastName(prev => ({ ...prev, value: e }))}
                            Icon={() => <MaterialIcons name='drive-file-rename-outline' style={styles.EditableTextIcon} />}
                            setState={setLastName}
                            onBlur={handleLastNameTextInputOnBlur}
                        />
                    </View>
                </View>
                <View style={{ marginBottom: 16 }}>
                    <PoppinsText style={styles.title}>Phone number</PoppinsText>
                    <EditableText
                        placeholder='Phone number'
                        state={mobileNumber}
                        keyboardType={'phone-pad'}
                        onChangeText={e => setMobileNumber(prev => ({ ...prev, value: e }))}
                        Icon={() => <MaterialIcons name='local-phone' style={styles.EditableTextIcon} />}
                        setState={setMobileNumber}
                        onBlur={handleMobileNumberTextInputOnBlur}
                    />
                </View>
                <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={() => {
                        //TODO
                    }}
                >
                    <PoppinsText style={styles.saveBtnText}>Save changes</PoppinsText>
                </TouchableOpacity>
                <View style={{ height: 85 }} />
            </ScrollView>
        </View>
    )
}

export default UserSettingsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 8
    },
    profileIcon: {
        fontSize: 130,
        marginRight: 8
    },
    profilePhoto: {
        marginRight: 8
    },
    icon: {
        color: 'white',
        fontSize: 14
    },
    editProfilePhotoBtn: {
        backgroundColor: '#E48700',
        padding: 6,
        borderRadius: 20,
        position: 'absolute',
        left: 100,
        top: 80
    },
    imageModal: {
        height: 130,
        width: 130,
        borderRadius: 130,
        marginBottom: 8
    },
    modalTitle: {
        marginBottom: 8
    },
    modalBtnsView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    modalBtn: {
        padding: 8
    },
    EditableTextIcon: {
        color: '#ADADAD',
        marginRight: 8,
        fontSize: 16
    },
    columnView: {
        width: '48%'
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16
    },
    title: {
        fontSize: 16,
        marginBottom: 8
    },
    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E48700',
        padding: 8,
        borderRadius: 16,
        justifyContent: 'center'
    },
    saveBtnText: {
        color: 'white'
    }
})