import { Animated, Dimensions, Image, Linking, Platform, StyleSheet, View } from 'react-native'
import * as Location from 'expo-location'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MapView, { Callout, Marker } from 'react-native-maps'
import { cancelResponder, getNearbyRequests, getRequestById } from '../api/EmergencyRequest'
import PoppinsText from '../components/PoppinsText'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { MaterialIcons } from '@expo/vector-icons'
import { Fontisto } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { Ionicons } from "@expo/vector-icons"
import { acceptRequest } from '../api/user'
import { socket } from '../api/socket.io'
import { useDispatch, useSelector } from 'react-redux'
import { loadUserAsync } from '../store/userAsyncThunks'
import { calculateDistance } from '../utils/locations'
import showToast from '../components/Toast'
import { sortRequests } from '../utils/sorting'

const { height } = Dimensions.get('window')

const TechnicianRequestsMapScreen = ({ route }) => {
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [region, setRegion] = useState(null)
    const [request, setRequest] = useState(null)
    const [mapPadding, setMapPadding] = useState(85)
    const [nearbyRequests, setNearbyRequests] = useState([])

    const snappingPoints = useMemo(() => {
        return [0.28, 0.60].map(percentage => percentage * height);
    }, [height]); //Snapping points must be in an ascending order

    const mapRef = useRef()
    const bottomSheetRef = useRef();
    const markerRef = useRef();
    const myLocationBtnBottom = useRef(new Animated.Value(0)).current
    const barOpacity = useRef(new Animated.Value(1)).current

    const fetchOngoingRequest = async () => {
        if (user.onGoingRequestId) {
            const response = await getRequestById(user.onGoingRequestId)

            if (response.status === 200) {
                setRequest(response.data.request)
            }
        }
    }

    const getCurrentLocationAndRequest = async () => {
        const perm = await Location.requestForegroundPermissionsAsync()

        try {
            if (perm.granted) {
                const location = await Location.getCurrentPositionAsync({})
                const nearby = await getNearbyRequests(location.coords.longitude, location.coords.latitude)

                setNearbyRequests(nearby.data.requests)
                setRegion({
                    longitude: location.coords.longitude,
                    latitude: location.coords.latitude,
                    latitudeDelta: 0.004757,
                    longitudeDelta: 0.006866
                })
            }

            await fetchOngoingRequest()
        } catch (err) {
            console.log(err.response.data);
        }
    }

    const handleSheetChanges = useCallback(index => {
        Animated.spring(myLocationBtnBottom, {
            toValue: -snappingPoints[index],
            useNativeDriver: true
        }).start((finished) => {
            if (finished.value) {
                setMapPadding(-finished.value)
            }
        })
    }, [])

    const handleMyLocationBtn = () => {
        mapRef.current.animateToRegion(region)
    }

    const handleMarkerLocation = () => {
        mapRef.current.fitToCoordinates([request?.coordinates])
    }

    const handleFocusMap = () => {
        mapRef.current.fitToCoordinates([region, request?.coordinates])
        markerRef.current?.showCallout()
    }

    const pulseAnimation = () => {
        return Animated.loop(
            Animated.sequence([
                Animated.timing(barOpacity, {
                    toValue: 0.2,
                    useNativeDriver: true,
                    duration: 750
                }),
                Animated.timing(barOpacity, {
                    toValue: 1,
                    useNativeDriver: true,
                    duration: 600
                })
            ])
        )
    }

    const openGPS = () => {
        if (Platform.OS == 'android') {
            Linking.openURL(`google.navigation:q=${request.coordinates.latitude},${request.coordinates.longitude}`)
        } else if (Platform.OS == 'ios') {
            Linking.openURL(`maps://app?saddr=${region.latitude},${region.longitude}&daddr=${request.coordinates.latitude},${request.coordinates.longitude}`)
        }
    }

    const handleCancelBTN = async () => {
        try {
            const response = await cancelResponder(request._id)
            if (response.status == 200) {
                setRequest(null)
                getCurrentLocationAndRequest()
                socket.emit('request:responder-leave', response.data.request.requestedBy._id)
            }
        } catch (err) {
            showToast("Couldn't leave request.")
        }

    }

    const handleAcceptBtn = async () => {
        try {
            const response = await acceptRequest(nearbyRequests[0]._id)
            if (response.status == 200) {
                setRequest(response.data.request)
                socket.emit('request:responder-join', { requestedBy: nearbyRequests[0].requestedBy })
            }
        } catch (err) {
            showToast("Couldn't take request. Please try again later.")
        }
    }

    useEffect(() => {
        getCurrentLocationAndRequest()
        pulseAnimation().start()
        socket.connect()
    }, [])

    useEffect(() => {
        if (request && region) {
            handleFocusMap()
        }
    }, [request?.state, region?.longitude])

    useEffect(() => {
        pulseAnimation().start()

        return () => {
            pulseAnimation().stop()
        }
    }, [nearbyRequests.length])

    useEffect(() => {
        handleFocusMap()
    }, [mapPadding])

    useEffect(() => {
        socket.on('request:add', async payload => {
            if ((await Location.getForegroundPermissionsAsync()).granted) {
                const currentLocation = await Location.getCurrentPositionAsync()

                if (calculateDistance(currentLocation.coords.longitude, currentLocation.coords.latitude, payload.coordinates.longitude, payload.coordinates.latitude) <= 5) {
                    setNearbyRequests(prev => [...prev, payload])
                }
            }
        })

        socket.on('request:cancelled', payload => {
            if (request) {
                setRequest(payload)
            }
            setNearbyRequests(prev => prev.filter(req => req._id !== payload._id))
            dispatch(loadUserAsync())
        })

        socket.on('request:accepted', payload => {
            setNearbyRequests(prev => prev.filter(req => req._id !== payload._id))
        })

        socket.on('request:responder-cancel', async payload => {
            console.log(payload);
            const currentLocation = await Location.getCurrentPositionAsync()
            const distance = calculateDistance(currentLocation.coords.longitude, currentLocation.coords.latitude, payload.coordinates.longitude, payload.coordinates.latitude)
            if (distance <= 5) {
                setNearbyRequests(prev => [...prev, payload].sort(sortRequests))
            }
        })
    }, [socket])

    return (
        <View style={styles.continer}>
            <MapView
                style={styles.map}
                provider='google'
                initialRegion={region}
                showsUserLocation
                showsMyLocationButton={false}
                ref={mapRef}
                mapPadding={{ bottom: mapPadding }}
            >
                {(nearbyRequests.length > 0 && request === null) && <Marker
                    coordinate={nearbyRequests[0].coordinates}
                    ref={markerRef}>
                    <Callout>
                        <PoppinsText>{nearbyRequests[0].type}</PoppinsText>
                    </Callout>
                </Marker>}
                {request && <Marker
                    coordinate={request.coordinates}
                    ref={markerRef}>
                    <Callout>
                        <PoppinsText>{request.type}</PoppinsText>
                    </Callout>
                </Marker>}
            </MapView>
            <Animated.View style={{ bottom: snappingPoints[0] / 3, transform: [{ translateY: myLocationBtnBottom }], ...styles.myLocationBtnView }}>
                <TouchableOpacity style={styles.myLocationBtn} onPress={handleMyLocationBtn}>
                    <MaterialIcons name='my-location' style={styles.icon} />
                </TouchableOpacity>
            </Animated.View>
            <BottomSheet
                ref={bottomSheetRef}
                onChange={handleSheetChanges}
                snapPoints={snappingPoints}
                index={0}
            >
                <BottomSheetView style={styles.bottomSheetContainer}>
                    {
                        (request === null && nearbyRequests.length === 0) &&
                        <View style={{ marginTop: 20 }}>
                            <Animated.View style={{
                                ...styles.bar,
                                opacity: barOpacity
                            }} />
                            <View style={{ alignItems: 'center', marginVertical: 20 }}>
                                <PoppinsText style={{ fontSize: 18 }} >
                                    Searching for emergency requests ....
                                </PoppinsText>
                            </View>
                        </View>
                    }
                    {
                        (request === null && nearbyRequests.length > 0) &&
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <PoppinsText style={{ color: '#E48700', fontSize: 25, padding: 8 }}>
                                    Request details
                                </PoppinsText>
                                <TouchableOpacity style={styles.navigationBTN} onPress={handleFocusMap}>
                                    <MaterialIcons name='center-focus-strong' style={styles.icon} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.userInfo}>
                                <View style={{ flexDirection: 'row' }}>
                                    {
                                        nearbyRequests[0].requestedBy?.profilePic?.length === 0 ?
                                            <Ionicons
                                                name='person-circle-outline'
                                                style={styles.profilePic}
                                            /> : <Image
                                                source={{ uri: nearbyRequests[0].requestedBy.profilePic }}
                                                style={styles.profilePic}
                                            />
                                    }
                                    <View>
                                        <PoppinsText style={{ fontSize: 18 }}>
                                            {nearbyRequests[0].requestedBy.firstName} {nearbyRequests[0].requestedBy.lastName}
                                        </PoppinsText>
                                        <PoppinsText style={styles.highLightedText}> {nearbyRequests[0].requestedBy.mobileNumber} </PoppinsText>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.navigationBTN} onPress={handleMarkerLocation}>
                                    <MaterialIcons name='location-pin' style={styles.icon} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ ...styles.requestInfo, paddingTop: 30 }}>
                                <PoppinsText style={styles.highLightedText}>Emergency</PoppinsText>
                                <PoppinsText>{nearbyRequests[0].type}</PoppinsText>
                            </View>
                            <View style={styles.requestInfo}>
                                <PoppinsText style={styles.highLightedText}>Car model</PoppinsText>
                                <PoppinsText>{nearbyRequests[0].vehicle.make} {nearbyRequests[0].vehicle.model}</PoppinsText>
                            </View>
                            <View style={styles.requestInfo}>
                                <PoppinsText style={styles.highLightedText}>Car number</PoppinsText>
                                <PoppinsText>{nearbyRequests[0].vehicle.licensePlate}</PoppinsText>
                            </View>
                            <TouchableOpacity
                                style={{ ...styles.btn, marginTop: 10, backgroundColor: '#E48700' }}
                                onPress={handleAcceptBtn}>
                                <PoppinsText style={styles.buttonText}>Accept request</PoppinsText>
                            </TouchableOpacity>
                        </View>
                    }
                    {
                        request &&
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <PoppinsText style={{ color: '#E48700', fontSize: 25, padding: 8 }}>
                                    Request details
                                </PoppinsText>
                                <TouchableOpacity style={styles.navigationBTN} onPress={handleFocusMap}>
                                    <MaterialIcons name='center-focus-strong' style={styles.icon} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.userInfo}>
                                <View style={{ flexDirection: 'row' }}>
                                    {
                                        request.requestedBy.profilePic.length === 0 ?
                                            <Ionicons
                                                name='person-circle-outline'
                                                style={styles.profilePic}
                                            /> : <Image
                                                source={{ uri: request.requestedBy.profilePic }}
                                                style={styles.profilePic}
                                            />
                                    }
                                    <View>
                                        <PoppinsText style={{ fontSize: 18 }}>
                                            {request.requestedBy.firstName} {request.requestedBy.lastName}
                                        </PoppinsText>
                                        <PoppinsText style={styles.highLightedText}> {request.requestedBy.mobileNumber} </PoppinsText>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.navigationBTN} onPress={handleMarkerLocation}>
                                    <MaterialIcons name='location-pin' style={styles.icon} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ ...styles.requestInfo, paddingTop: 30 }}>
                                <PoppinsText style={styles.highLightedText}>Emergency</PoppinsText>
                                <PoppinsText>{request.type}</PoppinsText>
                            </View>
                            <View style={styles.requestInfo}>
                                <PoppinsText style={styles.highLightedText}>Car model</PoppinsText>
                                <PoppinsText>{request.vehicle.make} {request.vehicle.model}</PoppinsText>
                            </View>
                            <View style={styles.requestInfo}>
                                <PoppinsText style={styles.highLightedText}>Car number</PoppinsText>
                                <PoppinsText>{request.vehicle.licensePlate}</PoppinsText>
                            </View>
                            {
                                request.state === 'inProgress' && <View>
                                    <View style={styles.acceptRequestView}>
                                        <PoppinsText style={{ fontSize: 18 }} >Request accepted</PoppinsText>
                                        <TouchableOpacity
                                            style={styles.navigatButton}
                                            onPress={openGPS}>
                                            <Fontisto name="navigate" size={24} color='#E48700' />
                                            <PoppinsText style={styles.navigateText}>
                                                Navigate
                                            </PoppinsText>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity
                                        style={{ ...styles.btn, backgroundColor: '#F9BFBF', marginTop: 8 }}
                                        onPress={handleCancelBTN}>
                                        <PoppinsText style={{ color: 'red' }}>Cancel</PoppinsText>
                                    </TouchableOpacity>
                                </View>
                            }
                            {
                                request.state === 'cancelled' && <View>
                                    <TouchableOpacity
                                        style={{ ...styles.btn, backgroundColor: '#E48700', marginTop: 8 }}
                                        onPress={() => setRequest(null)}
                                    >
                                        <PoppinsText style={{ color: 'white' }}>Load nearby requests</PoppinsText>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    }
                </BottomSheetView>
            </BottomSheet>
        </View>
    )
}

export default TechnicianRequestsMapScreen

const styles = StyleSheet.create({
    continer: {
        flex: 1,
    },
    map: {
        flex: 1
    },
    myLocationBtn: {
        backgroundColor: '#E48700',
        padding: 12,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    myLocationBtnView: {
        position: 'absolute',
        right: 16,
    },
    icon: {
        fontSize: 30,
        color: 'white'
    },
    bottomSheetContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
    },
    profilePic: {
        // fontSize: 60,
        marginRight: 8
    },
    requestInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 8,
    },
    highLightedText: {
        color: "#878791"
    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 25,
        marginHorizontal: 8
    },
    buttonText: {
        color: 'white',
        fontSize: 20
    },
    navigationBTN: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E48700',
        elevation: 5,
        borderRadius: 50,
        padding: 5,
        marginHorizontal: 8
    },
    bar: {
        height: 4,
        backgroundColor: '#E48700',
        marginHorizontal: 8,
        borderRadius: 4,
    },
    acceptRequestView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    navigatButton: {
        flexDirection: "row",
        alignItems: 'center',
        marginLeft: 10,
    },
    navigateText: {
        fontSize: 20,
        marginLeft: 5,
        color: '#E48700'
    },
})