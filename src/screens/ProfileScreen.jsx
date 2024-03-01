import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import PoppinsText from '../components/PoppinsText';
import { useDispatch, useSelector } from 'react-redux';
import ProfileScreenFlatListItem from '../components/ProfileScreenFlatListItem';
import { signOutAsync } from '../store/userSlice';
import * as Picker from 'expo-image-picker'
import { useState } from 'react';
import CustomModal from '../components/CustomModal';
import showToast from '../components/Toast';

const ProfileScreen = () => {
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [image, setImage] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)

    const listItems = [
        {
            icon: <Ionicons name='wallet-outline' style={styles.icon} />,
            label: 'Wallet',
            onPress: () => {
                //TODO
            }
        },
        {
            icon: <AntDesign name='car' style={styles.icon} />,
            label: 'Your vehicles',
            onPress: () => {
                //TODO
            }
        },
        {
            icon: <MaterialIcons name='history' style={styles.icon} />,
            label: 'Your history',
            onPress: () => {
                //TODO
            }
        },
        {
            icon: <Ionicons name='settings-outline' style={styles.icon} />,
            label: 'Settings',
            onPress: () => {
                //TODO
            }
        }
    ]

    const handleSignOutBtn = () => {
        dispatch(signOutAsync())
    }

    const handleEditProfilePictureBtn = async () => {
        const result = await Picker.launchImageLibraryAsync({
            mediaTypes: Picker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: false
        })

        if (!result.canceled) {
            setImage(result.assets[0].uri)
            setModalVisible(true)
        }
    }

    const resetModal = () => {
        setModalVisible(false)
        setImage(null)
    }

    const handleModalYesBtn = () => {
        setModalVisible(false)
        setImage(null)
        showToast('Not implemented yet')
    }

    return (
        <View style={styles.container}>
            <CustomModal
                visible={modalVisible}
                onRequestClose={resetModal}
            >
                <PoppinsText>Would you like to set this picture as your profile picture?</PoppinsText>
                {
                    image === null ?
                        null : <Image
                            source={{ uri: image }}
                            style={styles.modalImage}
                        />
                }
                <View style={styles.modalBtnsView}>
                    <TouchableOpacity
                        style={styles.modalBtns}
                        onPress={resetModal}
                    >
                        <PoppinsText style={{ color: 'red' }}>No</PoppinsText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.modalBtns}
                        onPress={handleModalYesBtn}
                    >
                        <PoppinsText style={{ color: 'green' }}>Yes</PoppinsText>
                    </TouchableOpacity>
                </View>
            </CustomModal>
            <View style={styles.userView}>
                <View>
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
                    <TouchableOpacity
                        style={styles.editProfilePictureButton}
                        onPress={handleEditProfilePictureBtn}
                    >
                        <AntDesign name='edit' style={{ color: 'white', fontSize: 16 }} />
                    </TouchableOpacity>
                </View>
                <PoppinsText style={styles.usernameText}>{user.username}</PoppinsText>
            </View>
            <FlatList
                style={styles.flatList}
                data={listItems}
                renderItem={({ item }) => <ProfileScreenFlatListItem
                    Icon={() => item.icon}
                    label={item.label}
                    onPress={item.onPress}
                />}
                keyExtractor={(_, index) => index}
                ItemSeparatorComponent={<View style={{ height: 8 }} />}
            />
            <TouchableOpacity
                style={styles.signOutBtn}
                onPress={handleSignOutBtn}
            >
                <Ionicons name='log-out-outline' style={{ ...styles.icon, color: 'red' }} />
                <PoppinsText style={styles.signOutText}>Sign out</PoppinsText>
            </TouchableOpacity>
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8
    },
    userView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16
    },
    profileIcon: {
        fontSize: 130
    },
    usernameText: {
        fontSize: 20,
        marginLeft: 8
    },
    profilePhoto: {
        width: 130,
        height: 130,
        marginRight: 8,
        borderRadius: 45
    },
    flatList: {
        flex: 1,
    },
    icon: {
        fontSize: 25
    },
    signOutBtn: {
        backgroundColor: '#F9BFBF',
        padding: 8,
        borderRadius: 16,
        marginVertical: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    signOutText: {
        fontSize: 20,
        color: 'red',
        marginLeft: 8
    },
    editProfilePictureButton: {
        padding: 6,
        backgroundColor: '#E48700',
        position: 'absolute',
        borderRadius: 16,
        alignSelf: 'flex-end',
        top: 85
    },
    modalImage: {
        height: 130,
        width: 130,
        borderRadius: 130,
        marginVertical: 8
    },
    modalBtnsView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    modalBtns: {
        padding: 8
    }
})