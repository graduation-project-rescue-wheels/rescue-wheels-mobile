import { Animated, Dimensions, Image, Linking, Platform, StyleSheet, View } from 'react-native'
import * as Location from 'expo-location'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MapView, { Callout, Marker } from 'react-native-maps'
import { acceptRequest, cancelResponder, getNearbyRequests, getRequestById, inProgressRequest, rateRequest } from '../api/EmergencyRequest'
import PoppinsText from '../components/PoppinsText'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { MaterialIcons } from '@expo/vector-icons'
import { Fontisto } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { socket } from '../api/socket.io'
import { useDispatch, useSelector } from 'react-redux'
import { loadUserAsync } from '../store/userAsyncThunks'
import { calculateDistance, getAddress } from '../utils/locations'
import showToast, { SMTH_WENT_WRONG } from '../components/Toast'
import { sortRequests } from '../utils/sorting'
import { useIsFocused } from '@react-navigation/native'
import MapViewDirections from 'react-native-maps-directions'
import { UPDATE_LOCATION_TASK } from '../tasks/locationTasks'
import RequestBackgroundLocationAccesModal from '../components/RequestBackgroundLocationAccesModal'
import StarFlatListItem from '../components/StarFlatListItem'
import { RATES } from '../utils/constants'
import { mainColor, secondryColor } from '../colors'

const { height } = Dimensions.get('window')

const TechnicianRequestsMapScreen = ({ route, navigation }) => {
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [region, setRegion] = useState(null)
    const [request, setRequest] = useState(null)
    const [mapPadding, setMapPadding] = useState(85)
    const [nearbyRequests, setNearbyRequests] = useState([])
    const [dropOffAddress, setDropOffAddress] = useState('')
    const [rate, setRate] = useState(0)
    const [backgroundLocationAccessModalVisible, setBackgroundLocationAccessModalVisible] = useState(false)
    const userMarkerImage = require('../assets/images/broken-car.png')
    const userDropOffMarkerImage = require('../assets/images/flag-marker.png')

    const snappingPoints = useMemo(() => {
        return [0.28, 0.80].map(percentage => percentage * height);
    }, [height]); //Snapping points must be in an ascending order

    const isFocused = useIsFocused()
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
        const coords = [region, request?.coordinates]

        if (request?.dropOffLocation) {
            coords.push(request.dropOffLocation)
        }

        mapRef.current.fitToCoordinates(coords)
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

    const registerBackGroundLocationTask = async () => {
        const permission = await Location.requestBackgroundPermissionsAsync()

        if (permission.granted) {
            await Location.startLocationUpdatesAsync(UPDATE_LOCATION_TASK, {
                accuracy: Location.LocationAccuracy.BestForNavigation,
                distanceInterval: 100,
                showsBackgroundLocationIndicator: true,
            })
        }
    }

    const unregisterBackGroundLocationTask = async () => {
        await Location.stopLocationUpdatesAsync(UPDATE_LOCATION_TASK)
    }

    const handleCancelBTN = async () => {
        try {
            const response = await cancelResponder(request._id)

            if (response.status == 200) {
                setRequest(null)
                socket.emit('request:responder-leave', response.data.request.requestedBy._id)
                await unregisterBackGroundLocationTask()
                dispatch(loadUserAsync())
            }
        } catch (err) {
            showToast("Couldn't leave request.")
        }
    }

    const handleAcceptBtn = async () => {
        try {
            const locationPermission = await Location.getBackgroundPermissionsAsync()

            if (locationPermission.granted) {
                const response = await acceptRequest(nearbyRequests[0]._id)

                if (response.status == 200) {
                    setRequest(response.data.request)
                    socket.emit('request:responder-join', { requestedBy: nearbyRequests[0].requestedBy })
                    dispatch(loadUserAsync())

                    await registerBackGroundLocationTask()
                }
            } else {
                setBackgroundLocationAccessModalVisible(true)
            }
        } catch (err) {
            showToast("Couldn't take request. Please try again later.")
        }
    }

    const handleStartServiceBTN = async () => {
        try {
            const response = await inProgressRequest(request._id)

            if (response.status == 200) {
                setRequest(response.data.request)
            }
        } catch (error) {

            console.log(error.response)
            showToast(SMTH_WENT_WRONG)
        }
    }

    const handleServiceFinishedBTN = () => {
        socket.emit("request:service-finish-confirm", request._id)
    }

    const handleSubmitRateBtn = async () => {
        try {
            if (rate > 0) {
                const response = await rateRequest(request._id, rate)
                if (response.status == 200) {
                    await unregisterBackGroundLocationTask()
                    setRequest(null)
                    showToast("Your submission has been sent.")
                    setRate(0)
                }
            }
            else showToast("Please rate your client")
        } catch (error) {
            console.log(error);
            showToast(SMTH_WENT_WRONG)
        }
    }

    const getDropOffAddressForPendingRequest = async () => {
        if (nearbyRequests[0].dropOffLocation) {
            const address = await getAddress(nearbyRequests[0].dropOffLocation, mapRef)
            setDropOffAddress(`${address.name} - ${address.subAdministrativeArea}`)
        }
    }

    const getDropOffAddressForRequest = async () => {
        if (request.dropOffLocation) {
            const address = await getAddress(request.dropOffLocation, mapRef)
            setDropOffAddress(`${address.name} - ${address.subAdministrativeArea}`)
        }
    }

    useEffect(() => {
        getCurrentLocationAndRequest()
        pulseAnimation().start()
        socket.connect()
    }, [isFocused])

    useEffect(() => {
        if (request && region) {
            handleFocusMap()
        }
    }, [request?.state, region?.longitude])

    useEffect(() => {
        if (!request) pulseAnimation().start()

        if (!request && nearbyRequests.length > 0) {
            getDropOffAddressForPendingRequest()
        }

        if (request) {
            getDropOffAddressForRequest()
            registerBackGroundLocationTask()
        }

        return () => {
            pulseAnimation().stop()
        }
    }, [nearbyRequests.length, request])

    useEffect(() => {
        handleFocusMap()
    }, [mapPadding])

    useEffect(() => {
        socket.on('request:cancelled', async payload => {
            if (payload._id === request?._id) {
                setRequest(payload)
                await unregisterBackGroundLocationTask()
            }

            setNearbyRequests(prev => prev.filter(req => req._id !== payload._id))
            dispatch(loadUserAsync())
        })

        socket.on('request:done', payload => {
            setRequest(payload)
            socket.emit('request:responder-leave', request.requestedBy._id)
            dispatch(loadUserAsync())
        })

        return () => {
            socket.off('request:cancelled')
            socket.off('request:done')
        }

    }, [request?.state])

    useEffect(() => {
        socket.on('request:add', async payload => {
            if ((await Location.getForegroundPermissionsAsync()).granted) {
                const currentLocation = await Location.getCurrentPositionAsync()
                console.log(calculateDistance(currentLocation.coords.longitude, currentLocation.coords.latitude, payload.coordinates.longitude, payload.coordinates.latitude));
                if (calculateDistance(currentLocation.coords.longitude, currentLocation.coords.latitude, payload.coordinates.longitude, payload.coordinates.latitude) <= 5) {
                    setNearbyRequests(prev => [...prev, payload])
                }
            }

        })


        socket.on('request:accepted', payload => {
            setNearbyRequests(prev => prev.filter(req => req._id !== payload._id))
        })

        socket.on('request:responder-cancel', async payload => {
            const currentLocation = await Location.getCurrentPositionAsync()
            const distance = calculateDistance(currentLocation.coords.longitude, currentLocation.coords.latitude, payload.coordinates.longitude, payload.coordinates.latitude)
            if (distance <= 5) {
                setNearbyRequests(prev => [...prev, payload].sort(sortRequests))
            }
        })
    }, [])

    return (
        <View style={styles.continer}>
            <RequestBackgroundLocationAccesModal
                onRequestClose={() => setBackgroundLocationAccessModalVisible(false)}
                visible={backgroundLocationAccessModalVisible}
            />
            <MapView
                style={styles.map}
                provider='google'
                initialRegion={region}
                showsUserLocation
                followsUserLocation
                showsMyLocationButton={false}
                ref={mapRef}
                mapPadding={{ bottom: mapPadding, top: 120 }}
            >
                {(nearbyRequests.length > 0 && request === null) && <>
                    <Marker
                        coordinate={nearbyRequests[0].coordinates}
                        ref={markerRef}
                        image={userMarkerImage}>
                        <Callout>
                            <PoppinsText>{nearbyRequests[0].type}</PoppinsText>
                        </Callout>
                    </Marker>
                    {
                        nearbyRequests[0].dropOffLocation && <Marker coordinate={nearbyRequests[0].dropOffLocation} image={userDropOffMarkerImage} />
                    }
                </>}
                {request && <>
                    <Marker
                        coordinate={request.coordinates}
                        ref={markerRef}
                        image={userMarkerImage}>
                        <Callout>
                            <PoppinsText>{request.type}</PoppinsText>
                        </Callout>
                    </Marker>
                    <MapViewDirections
                        apikey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}
                        origin={region}
                        destination={request.coordinates}
                        strokeColor={mainColor}
                        strokeWidth={4}
                    />
                    {request.dropOffLocation && <>
                        <MapViewDirections
                            apikey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}
                            origin={request.coordinates}
                            destination={request.dropOffLocation}
                            strokeColor={mainColor}
                            strokeWidth={4}
                            lineDashPattern={[4, 4]}
                        />
                        <Marker coordinate={request.dropOffLocation} image={userDropOffMarkerImage} />
                    </>}
                </>}
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
                                <PoppinsText style={{ color: mainColor, fontSize: 25, padding: 8 }}>
                                    Request details
                                </PoppinsText>
                                <TouchableOpacity style={styles.navigationBTN} onPress={handleFocusMap}>
                                    <MaterialIcons name='center-focus-strong' style={styles.icon} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.userInfo}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        source={nearbyRequests[0].requestedBy?.profilePic?.length === 0 ?
                                            require('../assets/images/avatar.png') :
                                            { uri: nearbyRequests[0].requestedByprofilePic }
                                        }
                                        style={styles.profilePic}
                                    />
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
                                <PoppinsText>{nearbyRequests[0].vehicle.make} {nearbyRequests[0].vehicle.model} {nearbyRequests[0].vehicle.modelYear}</PoppinsText>
                            </View>
                            <View style={styles.requestInfo}>
                                <PoppinsText style={styles.highLightedText}>Car number</PoppinsText>
                                <PoppinsText>{nearbyRequests[0].vehicle.licensePlate}</PoppinsText>
                            </View>
                            {
                                nearbyRequests[0].type === 'Other' && <View style={styles.requestInfo}>
                                    <PoppinsText style={styles.highLightedText}>drop off</PoppinsText>
                                    <PoppinsText>{dropOffAddress}</PoppinsText>
                                </View>
                            }
                            <TouchableOpacity
                                style={{ ...styles.btn, marginTop: 10, backgroundColor: secondryColor }}
                                onPress={handleAcceptBtn}>
                                <PoppinsText style={styles.buttonText}>Accept request</PoppinsText>
                            </TouchableOpacity>
                        </View>
                    }
                    {
                        request &&
                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <PoppinsText style={{ color: mainColor, fontSize: 25, padding: 8 }}>
                                    Request details
                                </PoppinsText>
                                <TouchableOpacity style={styles.navigationBTN} onPress={handleFocusMap}>
                                    <MaterialIcons name='center-focus-strong' style={styles.icon} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.userInfo}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        source={request.requestedBy?.profilePic?.length === 0 ?
                                            require('../assets/images/avatar.png') :
                                            { uri: request.requestedBy.profilePic }
                                        }
                                        style={styles.profilePic}
                                    />
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
                                <PoppinsText>{request.vehicle.make} {request.vehicle.model} {request.vehicle.modelYear}</PoppinsText>
                            </View>
                            <View style={styles.requestInfo}>
                                <PoppinsText style={styles.highLightedText}>Car number</PoppinsText>
                                <PoppinsText>{request.vehicle.licensePlate}</PoppinsText>
                            </View>
                            {request.type === 'Other' && <View style={styles.requestInfo}>
                                <PoppinsText style={styles.highLightedText}>Drop off</PoppinsText>
                                <PoppinsText>{dropOffAddress}</PoppinsText>
                            </View>}
                            {
                                request.state === 'responding' && <>
                                    <TouchableOpacity
                                        style={{ ...styles.btn, backgroundColor: secondryColor }}
                                        onPress={openGPS}>
                                        <Fontisto name="navigate" size={20} color={mainColor} style={{ marginRight: 8 }} />
                                        <PoppinsText style={{ color: mainColor }}>
                                            Navigate
                                        </PoppinsText>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ ...styles.btn, backgroundColor: secondryColor, marginTop: 8 }}
                                        onPress={handleStartServiceBTN}>
                                        <PoppinsText style={{ color: mainColor }}>Start service</PoppinsText>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ ...styles.btn, backgroundColor: '#F9BFBF', marginTop: 8 }}
                                        onPress={handleCancelBTN}>
                                        <PoppinsText style={{ color: 'red' }}>Cancel</PoppinsText>
                                    </TouchableOpacity>
                                </>
                            }
                            {
                                request.state === 'inProgress' && <View>
                                    <View style={{ alignSelf: "center" }}>
                                        <PoppinsText>Service started</PoppinsText></View>
                                    <TouchableOpacity
                                        style={{ ...styles.btn, backgroundColor: secondryColor, marginTop: 8 }}
                                        onPress={handleServiceFinishedBTN}
                                    >
                                        <PoppinsText style={{ color: mainColor }}>Finish service</PoppinsText>
                                    </TouchableOpacity>
                                </View>

                            }
                            {
                                request.state === 'cancelled' && <View>
                                    <TouchableOpacity
                                        style={{ ...styles.btn, backgroundColor: '#E48700', marginTop: 8 }}
                                        onPress={async () => {
                                            await unregisterBackGroundLocationTask()
                                            setRequest(null)
                                        }}
                                    >
                                        <PoppinsText style={{ color: 'white' }}>Load nearby requests</PoppinsText>
                                    </TouchableOpacity>
                                </View>
                            }
                            {
                                (request.state === 'done' && !request.isUserRated) && <>
                                    <PoppinsText style={{ margin: 8, fontSize: 16 }}>Rate {request.requestedBy.firstName}</PoppinsText>
                                    <FlatList
                                        data={RATES}
                                        renderItem={({ item, index }) => <StarFlatListItem index={index} rate={rate} onPress={() => setRate(item)} />}
                                        horizontal
                                        keyExtractor={(item) => item}
                                        contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
                                        style={{ flexGrow: 0 }}
                                        ItemSeparatorComponent={<View style={{ width: 5 }} />}
                                    />
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 8 }}>
                                        <TouchableOpacity
                                            style={{ ...styles.btn }}
                                            onPress={async () => {
                                                navigation.goBack()
                                                await unregisterBackGroundLocationTask()
                                                setRequest(null)
                                            }}
                                        >
                                            <PoppinsText style={{ color: mainColor }}>Skip</PoppinsText>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ ...styles.btn, backgroundColor: secondryColor }}
                                            onPress={handleSubmitRateBtn}
                                        >
                                            <PoppinsText style={{ color: mainColor }}>Submit</PoppinsText>
                                        </TouchableOpacity>
                                    </View>
                                </>
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
        backgroundColor: secondryColor,
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
        color: mainColor
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
        height: 60,
        width: 60,
        borderRadius: 60,
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
        marginHorizontal: 8,
        flexDirection: 'row'
    },
    buttonText: {
        color: mainColor,
        fontSize: 20
    },
    navigationBTN: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: secondryColor,
        elevation: 5,
        borderRadius: 50,
        padding: 5,
        marginHorizontal: 8
    },
    bar: {
        height: 4,
        backgroundColor: mainColor,
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
        backgroundColor: secondryColor
    },
    navigateText: {
        fontSize: 20,
        marginLeft: 5,
        color: mainColor
    },
})