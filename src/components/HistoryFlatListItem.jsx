import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { getRequestById } from '../api/EmergencyRequest'
import MapView, { Marker } from 'react-native-maps'
import PoppinsText from './PoppinsText'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { getAddress } from '../utils/locations'
import { useSelector } from 'react-redux'
import { mainColor } from '../colors'

const HistoryFlatListItem = ({ item, onPress }) => {
    const { user } = useSelector(state => state.user)
    const [request, setRequest] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [address, setAddress] = useState('')
    const [dateAndTime, setDateAndTime] = useState('')
    const mapRef = useRef()

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const response = await getRequestById(item)

                if (response.status === 200) {
                    const date = new Date(response.data.request.createdAt)
                    getAddress(response.data.request.coordinates).then(address => {
                        setAddress(`${address.data.results[0].address_components[2].long_name}, ${address.data.results[0].address_components[3].long_name}, ${address.data.results[0].address_components[4].long_name}`)
                    })
                    setRequest(response.data.request)
                    setDateAndTime(`${date.toDateString()} ${date.toLocaleTimeString()}`)
                    setError(null)
                }
            } catch (err) {
                console.log(err);
                setError(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        if (mapRef.current && request) {

        }
    }, [mapRef?.current, request?._id])

    return (
        <Pressable
            style={styles.container}
            onPress={onPress}
        >
            {
                isLoading ?
                    <ActivityIndicator size={'large'} color={mainColor} /> : error ?
                        <View style={styles.errorView}>
                            <MaterialIcons name='error-outline' style={styles.errorIcon} />
                            <PoppinsText style={styles.errorText}>Something went wrong</PoppinsText>
                        </View> : <>
                            {request && <>
                                <MapView
                                    ref={mapRef}
                                    provider='google'
                                    region={request && {
                                        ...request.coordinates,
                                        latitudeDelta: 0.006866,
                                        longitudeDelta: 0.004757
                                    }}
                                    style={styles.map}
                                    scrollEnabled={false}
                                >
                                    <Marker coordinate={request.coordinates} />
                                </MapView>
                                <View style={{ marginHorizontal: 8 }}>
                                    <View style={styles.rowView}>
                                        <Ionicons name='person-outline' style={styles.icon} />
                                        {
                                            user.role === "Technician" &&
                                            <PoppinsText style={styles.infoText}>{request.requestedBy.firstName} {request.requestedBy.lastName}</PoppinsText>
                                        }
                                        {
                                            user.role === "User" &&
                                            <PoppinsText style={styles.infoText}>{request.responder.firstName} {request.responder.lastName}</PoppinsText>
                                        }
                                    </View>
                                    <View style={styles.rowView}>
                                        <Ionicons name='location-outline' style={{ ...styles.icon, alignSelf: 'flex-start' }} />
                                        <PoppinsText style={styles.infoText}>{address}</PoppinsText>
                                    </View>
                                    <View style={styles.rowView}>
                                        <Ionicons name='calendar-outline' style={styles.icon} />
                                        <PoppinsText style={styles.infoText}>{dateAndTime}</PoppinsText>
                                    </View>
                                </View>
                            </>}
                        </>
            }
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