import { Animated, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import MapView, { Callout, Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PoppinsText from '../components/PoppinsText'
import { MaterialIcons } from '@expo/vector-icons'
import { cancelRequest, getRequestById } from '../api/EmergencyRequest'
import showToast, { SMTH_WENT_WRONG } from '../components/Toast'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { socket } from '../api/socket.io'
import Connecting from '../components/Connecting'
import { useDispatch } from 'react-redux'
import { loadUserAsync } from '../store/userAsyncThunks'

const { height, width } = Dimensions.get('window')

const UserEmergencyMapScreen = ({ route }) => {
    const { id } = route.params
    const dispatch = useDispatch()

    const [region, setRegion] = useState(null)
    const [request, setRequest] = useState(null)
    const [mapPadding, setMapPadding] = useState(85)

    const snappingPoints = useMemo(() => {
        return [0.23, 0.55].map(percentage => percentage * height);
    }, [height]); //Snapping points must be in an ascending order

    const mapRef = useRef()
    const bottomSheetRef = useRef();
    const myLocationBtnBottom = useRef(new Animated.Value(0)).current
    const barOpacity = useRef(new Animated.Value(1)).current

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

    const getCurrentLocation = async () => {
        const locationPermission = await Location.requestForegroundPermissionsAsync()

        if (locationPermission.granted) {
            const location = await Location.getCurrentPositionAsync({})
            console.log(location.coords);

            setRegion({
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
                latitudeDelta: 0.004757,
                longitudeDelta: 0.006866
            })
        }
    }

    const fetchRequest = async () => {
        try {
            const response = await getRequestById(id)

            if (response.status === 200) {
                setRequest(response.data.request)
            }
        } catch (err) {
            console.log(err);
            showToast("Couldn't get request data")
        }
    }

    const handleMyLocationBtn = () => {
        mapRef.current.animateToRegion(region)
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

    const handleCancelRequestBtn = async () => {
        // socket.emit("request:cancel", request._id)
        try {
            const response = await cancelRequest(request._id)

            if (response.status === 200) {
                setRequest(response.data.request)
            }
        } catch (err) {
            console.log(err);
            showToast(SMTH_WENT_WRONG)
        }
    }

    useEffect(() => {
        getCurrentLocation()
        socket.connect()

        if (id) {
            fetchRequest()
        }
    }, [])

    useEffect(() => {
        pulseAnimation().start()
    }, [request?.state])

    useEffect(() => {
        socket.on('request:cancelled', async () => {
            await fetchRequest()
            dispatch(loadUserAsync())
        })

        socket.on('request:accepted', async (payload) => {
            if (id === payload._id) {
                await fetchRequest()
            }
        })

        socket.on('request:responder-cancel', async (payload) => {
            if (id === payload._id) {
                await fetchRequest()
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
                onUserLocationChange={(e) => {
                    const { longitude, latitude } = e.nativeEvent.coordinate
                    setRegion(prev => ({
                        ...prev, longitude, latitude
                    }))
                }}
            >
                {/* {region && <Marker coordinate={{
                    latitude: region.latitude,
                    longitude: region.longitude
                }}>
                    <Callout>
                        <PoppinsText>I'm here</PoppinsText>
                    </Callout>
                </Marker>} */}
            </MapView>
            <Animated.View style={{ bottom: snappingPoints[0] / 3, transform: [{ translateY: myLocationBtnBottom }], ...styles.myLocationBtnView }}>
                <TouchableOpacity style={styles.myLocationBtn} onPress={handleMyLocationBtn}>
                    <MaterialIcons name='my-location' style={styles.icon} />
                </TouchableOpacity>
            </Animated.View>
            {request && <BottomSheet
                ref={bottomSheetRef}
                onChange={handleSheetChanges}
                snapPoints={snappingPoints}
                index={0}
            >
                <BottomSheetView style={styles.bottomSheetContainer}>
                    <View style={styles.barsView}>
                        <Animated.View style={{
                            ...styles.bar,
                            opacity: request.state === 'pending' ? barOpacity : 1
                        }} />
                        <Animated.View style={{
                            ...styles.bar,
                            opacity: request.state === 'pending' ? 0 : request.state === 'inProgress' ? barOpacity : 1
                        }} />
                    </View>
                    {
                        request.state === 'pending' && <View style={{ alignItems: 'center' }}>
                            <PoppinsText style={styles.stateMessage}>Connecting you to a technician</PoppinsText>
                            {/* <Connecting /> */}
                        </View>
                    }
                    {
                        request.state === 'inProgress' && <PoppinsText style={styles.stateMessage}>{`${request.responder?.firstName} ${request.responder?.lastName}`} is on his way</PoppinsText>
                    }
                    {
                        request.state === 'cancelled' && <PoppinsText style={styles.stateMessage}>Your request has been cancelled</PoppinsText>
                    }
                    {
                        (request.state === 'pending' || request.state === 'inProgress') && <TouchableOpacity
                            style={{ ...styles.btn, backgroundColor: '#F9BFBF' }}
                            onPress={handleCancelRequestBtn}
                        >
                            <PoppinsText style={{ color: 'red' }}>Cancel</PoppinsText>
                        </TouchableOpacity>
                    }
                </BottomSheetView>
            </BottomSheet>}
        </View>
    )
}

export default UserEmergencyMapScreen

const styles = StyleSheet.create({
    continer: {
        flex: 1
    },
    map: {
        flex: 1
    },
    myLocationBtnView: {
        position: 'absolute',
        right: 16
    },
    myLocationBtn: {
        backgroundColor: '#E48700',
        padding: 12,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    icon: {
        fontSize: 30,
        color: 'white'
    },
    bottomSheetContainer: {
        flex: 1,
        paddingHorizontal: 8
    },
    bar: {
        height: 4,
        backgroundColor: '#E48700',
        marginHorizontal: 4,
        width: (width / 2) - 8,
        borderRadius: 4
    },
    barsView: {
        width,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    btn: {
        borderRadius: 16,
        padding: 8,
        alignItems: 'center'
    },
    stateMessage: {
        textAlign: 'center',
        marginBottom: 16
    }
})