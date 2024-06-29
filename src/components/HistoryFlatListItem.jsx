import { Pressable, StyleSheet, View } from 'react-native'
import { useEffect, useState } from 'react'
import MapView, { Marker } from 'react-native-maps'
import PoppinsText from './PoppinsText'
import { Ionicons } from '@expo/vector-icons'
import { getAddress } from '../utils/locations'
import { useSelector } from 'react-redux'

const HistoryFlatListItem = ({ item, onPress, style }) => {
    const { user } = useSelector(state => state.user)
    const [address, setAddress] = useState('')
    const [dateAndTime, setDateAndTime] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const date = new Date(item.createdAt)
                getAddress(item.coordinates).then(address => {
                    setAddress(`${address.data.results[0].address_components[2].long_name}, ${address.data.results[0].address_components[3].long_name}, ${address.data.results[0].address_components[4].long_name}`)
                })
                setDateAndTime(`${date.toDateString()} ${date.toLocaleTimeString()}`)
            } catch (err) {
                console.log(err);
            }
        }

        fetchData()
    }, [])

    return (
        <Pressable
            style={{...styles.container, ...style}}
            onPress={onPress}
        >
            <MapView
                provider='google'
                region={item && {
                    ...item.coordinates,
                    latitudeDelta: 0.006866,
                    longitudeDelta: 0.004757
                }}
                style={styles.map}
                scrollEnabled={false}
            >
                <Marker coordinate={item.coordinates} />
            </MapView>
            <View style={{ marginHorizontal: 8 }}>
                <View style={styles.rowView}>
                    <Ionicons name='person-outline' style={styles.icon} />
                    {
                        user.role === "Technician" &&
                        <PoppinsText style={styles.infoText}>{item.requestedBy.firstName} {item.requestedBy.lastName}</PoppinsText>
                    }
                    {
                        user.role === "User" &&
                        <PoppinsText style={styles.infoText}>{item.responder.firstName} {item.responder.lastName}</PoppinsText>
                    }
                </View>
                <View style={styles.rowView}>
                    <Ionicons name='location-outline' style={{ ...styles.icon, alignSelf: 'flex-start' }} />
                    <PoppinsText style={styles.infoText} numberOfLines={1}>{address}</PoppinsText>
                </View>
                <View style={styles.rowView}>
                    <Ionicons name='calendar-outline' style={styles.icon} />
                    <PoppinsText style={styles.infoText}>{dateAndTime}</PoppinsText>
                </View>
            </View>
        </Pressable>
    )
}

export default HistoryFlatListItem

const styles = StyleSheet.create({
    container: {
        elevation: 5,
        margin: 8,
        borderRadius: 16,
        backgroundColor: 'white',
        height: 200,
        overflow: 'hidden'
    },
    errorView: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8
    },
    errorIcon: {
        color: 'red',
        fontSize: 50
    },
    errorText: {
        color: 'red',
        fontSize: 20
    },
    map: {
        borderRadius: 16,
        flex: 1
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2
    },
    icon: {
        color: '#969696',
        fontSize: 14,
        marginRight: 4
    },
    infoText: {
        color: '#969696',
        fontSize: 11,
        marginRight: 8
    }
})