import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Ionicons } from "@expo/vector-icons"
import PoppinsText from '../components/PoppinsText'
import { AntDesign } from '@expo/vector-icons'
import * as Picker from 'expo-image-picker'
import { useRef, useState } from 'react'
import CustomModal from '../components/CustomModal'
import EditableText from '../components/EditableText'
import { MaterialIcons } from '@expo/vector-icons'
import { validateConfirmationPassword, validateFirstName, validateLastName, validateOldPassword, validatePassword, validatePhoneNumber } from '../utils/inputValidations'
import CustomTextInput from '../components/CustomTextInput'
import ValidationMessage from '../components/ValidationMessage'
import { deleteUserAsync, updatePasswordAsync, updateUserAsync } from '../store/UserAsyncThunks'

const UserSettingsScreen = ({ navigation }) => {
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [image, setImage] = useState(null)
    const [confirmPhotoModalVisible, setConfirmPhotoModalVisible] = useState(false)
    const [confirmDeleteUserModalVisible, setConfirmDeleteUserModalVisible] = useState(false)
    const [confirmNewPasswordModalVisible, setConfirmNewPasswordModalVisible] = useState(false)
    const [firstName, setFirstName] = useState({
        value: user.firstName,
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [lastName, setLastName] = useState({
        value: user.lastName,
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [mobileNumber, setMobileNumber] = useState({
        value: user.mobileNumber,
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [newPassword, setNewPassword] = useState({
        value: '',
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [confirmNewPassword, setConfirmNewPassword] = useState({
        value: '',
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [oldPassword, setOldPassword] = useState({
        value: '',
        isFocused: false,
        validation: {
            isValid: true,
            message: ''
        }
    })
    const scrollViewRef = useRef()

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
            validation: validateFirstName(firstName.value),
            isFocused: false
        }))
    }

    const handleLastNameTextInputOnBlur = () => {
        setLastName(prev => ({
            ...prev,
            validation: validateLastName(lastName.value),
            isFocused: false
        }))
    }

    const handleMobileNumberTextInputOnBlur = () => {
        setMobileNumber(prev => ({
            ...prev,
            validation: validatePhoneNumber(mobileNumber.value),
            isFocused: false
        }))
    }

    const handleNewPasswordTextInputOnBlur = () => {
        setNewPassword(prev => ({
            ...prev,
            isFocused: false
        }))
    }

    const handleConfirmNewPasswordTextInputOnBlur = () => {
        setConfirmNewPassword(prev => ({
            ...prev,
            validation: validateConfirmationPassword(newPassword.value, confirmNewPassword.value),
            isFocused: false
        }))
    }

    const handleOldPasswordTextInputOnBlur = () => {
        setOldPassword(prev => ({
            ...prev,
            validation: validateOldPassword(oldPassword.value),
            isFocused: false
        }))
    }

    const handleSaveChangesBtnOnPress = () => {
        const firstNameValidationResult = validateFirstName(firstName.value)
        const lastNameValidationResult = validateFirstName(lastName.value)
        const mobileNumberValidationResult = validateFirstName(mobileNumber.value)
        const newPasswordValidationResult = validatePassword(newPassword.value)

        setFirstName(prev => ({
            ...prev,
            validation: firstNameValidationResult
        }))

        setLastName(prev => ({
            ...prev,
            validation: lastNameValidationResult
        }))

        setMobileNumber(prev => ({
            ...prev,
            validation: mobileNumberValidationResult
        }))

        setNewPassword(prev => ({
            ...prev,
            validation: newPasswordValidationResult
        }))

        if (firstNameValidationResult &&
            lastNameValidationResult &&
            mobileNumberValidationResult &&
            (firstName.value !== user.firstName ||
                lastName.value !== user.lastName ||
                mobileNumber.value !== user.mobileNumber)) {
            dispatch(updateUserAsync({
                firstName: firstName.value,
                lastName: lastName.value,
                mobileNumber: mobileNumber.value
            }))
        }

        if (newPassword.value.length > 0) {

            if (newPasswordValidationResult.isValid) {
                setConfirmNewPasswordModalVisible(true)
            }
        }
    }

    const resetConfirmNewPasswordModal = () => {
        setConfirmNewPasswordModalVisible(false)
        setConfirmNewPassword({
            value: '',
            isFocused: false,
            validation: {
                isValid: true,
                message: ''
            }
        })
        setOldPassword({
            value: '',
            isFocused: false,
            validation: {
                isValid: true,
                message: ''
            }
        })
        setNewPassword({
            value: '',
            isFocused: false,
            validation: {
                isValid: true,
                message: ''
            }
        })
    }

    const handleUpdatePasswordConfirmBTN = () => {
        const confirmNewPasswordResult = validateConfirmationPassword(newPassword.value, confirmNewPassword.value)
        const oldPasswordValidationResult = validateOldPassword(oldPassword.value)

        setConfirmNewPassword(prev => ({
            ...prev,
            validation: confirmNewPasswordResult
        }))

        setOldPassword(prev => ({
            ...prev,
            validation: oldPasswordValidationResult
        }))

        if (confirmNewPasswordResult.isValid &&
            oldPasswordValidationResult.isValid &&
            newPassword.value != oldPassword.value) {
            dispatch(updatePasswordAsync({
                oldPassword: oldPassword.value,
                newPassword: newPassword.value,
                confirmNewPassword: confirmNewPassword.value
            }))
        }
    }

    return (
        <View style={styles.container}>
            {/*profile photo modal*/}
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
            {/*delete account modal*/}
            <CustomModal
                visible={confirmDeleteUserModalVisible}
                onRequestClose={() => setConfirmDeleteUserModalVisible(false)}
            >
                <PoppinsText>Would you like to delete your account?</PoppinsText>
                <View style={styles.modalBtnsView}>
                    <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={() => {
                            setConfirmDeleteUserModalVisible(false)
                        }}
                    >
                        <PoppinsText style={{ color: 'red' }}>No</PoppinsText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={() => {
                            dispatch(deleteUserAsync())
                        }}
                    >
                        <PoppinsText style={{ color: 'green' }}>Yes</PoppinsText>
                    </TouchableOpacity>
                </View>
            </CustomModal>
            {/*new password modal*/}
            <CustomModal
                visible={confirmNewPasswordModalVisible}
                onRequestClose={resetConfirmNewPasswordModal}
            >
                <PoppinsText style={{
                    alignSelf: 'flex-start'
                }}>
                    Confirm your new password
                </PoppinsText>
                <CustomTextInput
                    Icon={() => <MaterialIcons
                        name='password'
                        style={{
                            ...styles.textInputIcon,
                            color: confirmNewPassword.isFocused ? '#E48700' : confirmNewPassword.validation.isValid ? '#ADADAD' : 'red'
                        }}
                    />}
                    onBlur={handleConfirmNewPasswordTextInputOnBlur}
                    onChangeText={e => setConfirmNewPassword({ ...confirmNewPassword, value: e })}
                    onFocus={() => setConfirmNewPassword(prev => ({
                        ...prev,
                        isFocused: true
                    }))}
                    placeholder={'Confirm new password'}
                    secureTextEntry={true}
                    state={confirmNewPassword}
                />
                <ValidationMessage state={confirmNewPassword} />
                <PoppinsText style={{ alignSelf: 'flex-start' }}>Enter your old password</PoppinsText>
                <CustomTextInput
                    Icon={() => <MaterialIcons
                        name='password'
                        style={{
                            ...styles.textInputIcon,
                            color: oldPassword.isFocused ? '#E48700' : oldPassword.validation.isValid ? '#ADADAD' : 'red'
                        }}
                    />}
                    onBlur={handleOldPasswordTextInputOnBlur}
                    onChangeText={e => setOldPassword({ ...oldPassword, value: e })}
                    onFocus={() => setOldPassword(prev => ({
                        ...prev,
                        isFocused: true
                    }))}
                    placeholder={'Old password'}
                    secureTextEntry={true}
                    state={oldPassword}
                />
                <ValidationMessage state={oldPassword} />
                <View style={styles.modalBtnsView}>
                    <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={resetConfirmNewPasswordModal}
                    >
                        <PoppinsText style={{ color: '#ADADAD' }}>Cancel</PoppinsText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={handleUpdatePasswordConfirmBTN}
                    >
                        <PoppinsText style={{ color: '#E48700' }}>Confirm</PoppinsText>
                    </TouchableOpacity>
                </View>
            </CustomModal>
            <ScrollView style={{ flex: 1 }} ref={scrollViewRef} onLayout={() => scrollViewRef.current.scrollToEnd({ animated: true })}>
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
                    <AntDesign name='edit' style={styles.editIcon} />
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
                <View style={{ marginBottom: 16 }}>
                    <PoppinsText style={styles.title}>Change password</PoppinsText>
                    <EditableText
                        placeholder='New password'
                        state={newPassword}
                        onChangeText={e => setNewPassword(prev => ({ ...prev, value: e }))}
                        Icon={() => <MaterialIcons name='password' style={styles.EditableTextIcon} />}
                        setState={setNewPassword}
                        onBlur={handleNewPasswordTextInputOnBlur}
                        secureTextEntry={true}
                    />
                </View>
                <TouchableOpacity
                    style={{
                        ...styles.btn,
                        backgroundColor: '#E48700'
                    }}
                    onPress={handleSaveChangesBtnOnPress}
                >
                    <PoppinsText style={styles.saveBtnText}>Save changes</PoppinsText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        ...styles.btn,
                        backgroundColor: '#F9BFBF',
                    }}
                    onPress={() => setConfirmDeleteUserModalVisible(true)}
                >
                    <PoppinsText style={{ color: 'red' }}>Delete account</PoppinsText>
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
    editIcon: {
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
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 16,
        justifyContent: 'center',
        marginBottom: 16
    },
    saveBtnText: {
        color: 'white'
    },
    textInputIcon: {
        paddingRight: 8,
        fontSize: 20
    }
})