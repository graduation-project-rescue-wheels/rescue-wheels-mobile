import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import PoppinsText from '../components/PoppinsText';
import { useDispatch, useSelector } from 'react-redux';
import ProfileScreenFlatListItem from '../components/ProfileScreenFlatListItem';
import { signOutAsync } from '../store/userAsyncThunks';
import { useMemo } from 'react';
import * as TaskManager from 'expo-task-manager'
import * as Location from 'expo-location'
import { UPDATE_LOCATION_TASK } from '../tasks/locationTasks'

const ProfileScreen = ({ navigation }) => {
    const { user } = useSelector(state => state.user)
    const username = useMemo(() => `${user.firstName} ${user.lastName}`, [user.firstName, user.lastName])
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
                navigation.navigate('Your vehicles')
            }
        },
        {
            icon: <MaterialIcons name='history' style={styles.icon} />,
            label: 'Your history',
            onPress: () => {
                navigation.navigate('History-stack')
            }
        },
        {
            icon: <Ionicons name='settings-outline' style={styles.icon} />,
            label: 'Settings',
            onPress: () => {
                navigation.navigate('Settings')
            }
        }
    ]

    const handleSignOutBtn = async () => {
        dispatch(signOutAsync(navigation))

        if (await TaskManager.isTaskRegisteredAsync(UPDATE_LOCATION_TASK)) {
            Location.stopLocationUpdatesAsync(UPDATE_LOCATION_TASK)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.userView}>
                <Image
                    source={user.profilePic.length !== 0 ? { uri: user.profilePic } : require('../assets/images/avatar.png')}
                    style={styles.profilePhoto}
                    resizeMode='cover'
                />
                <PoppinsText style={styles.usernameText}>{username}</PoppinsText>
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
            <View style={{ height: 85 }} />
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8,
        backgroundColor: 'white'
    },
    userView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16
    },
    profileIcon: {
        fontSize: 130
    },
    usernameText: {
        fontSize: 20,
        marginLeft: 8
    },
    profilePhoto: {
        width: 110,
        height: 110,
        marginRight: 8,
        borderRadius: 110,
    },
    flatList: {
        flex: 1
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