import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import PoppinsText from '../components/PoppinsText';
import { useDispatch, useSelector } from 'react-redux';
import ProfileScreenFlatListItem from '../components/ProfileScreenFlatListItem';
import { signOutAsync } from '../store/userSlice';

const ProfileScreen = () => {
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()

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

    return (
        <View style={styles.container}>
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
    }
})