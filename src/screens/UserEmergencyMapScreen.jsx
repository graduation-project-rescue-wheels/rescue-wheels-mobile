import { Animated, Dimensions, Image, Linking, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import MapView, { Callout, Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import PoppinsText from '../components/PoppinsText'
import { MaterialIcons } from '@expo/vector-icons'
import { cancelRequest, finishRequest, getRequestById, rateRequest } from '../api/EmergencyRequest'
import showToast, { SMTH_WENT_WRONG } from '../components/Toast'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { socket } from '../api/socket.io'
import Connecting from '../components/Connecting'
import { useDispatch } from 'react-redux'
import { loadUserAsync } from '../store/userAsyncThunks'
import MapViewDirections from 'react-native-maps-directions'
import CustomModal from '../components/CustomModal'
import { FlatList } from 'react-native-gesture-handler'
import { RATES } from '../utils/constants'
import StarFlatListItem from '../components/StarFlatListItem'
import { mainColor, secondryColor } from '../colors'

const { height } = Dimensions.get('window')

const UserEmergencyMapScreen = ({ route, navigation }) => {
    const { id } = route.params
    const dispatch = useDispatch()

    const [region, setRegion] = useState(null)
    const [request, setRequest] = useState(null)
    const [mapPadding, setMapPadding] = useState(85)
    const [responderCoordinate, setResponderCoordinate] = useState(null)
    const [ConfirmModalVisible, setConfirmModalVisible] = useState(false)
    const [rate, setRate] = useState(0)

    const snappingPoints = useMemo(() => {
        return [0.33, 0.6].map(percentage => percentage * height);
    }, [height]); //Snapping points must be in an ascending order

    const mapRef = useRef()
    const bottomSheetRef = useRef();
    const myLocationBtnBottom = useRef(new Animated.Value(0)).current
    const barOpacity = useRef(new Animated.Value(1)).current
    const techIcon = require('../assets/images/tow-truck.png')

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

    const handleConfirmEndServiceBTN = async () => {
        try {
            const response = await finishRequest(request._id)

            if (response.status === 200) {
                setRequest(response.data.request)
                setConfirmModalVisible(false)
                dispatch(loadUserAsync())
            }
        } catch (error) {
            console.log(error);
            showToast(SMTH_WENT_WRONG)
        }
    }

    const handleCallBtn = () => {
        if (Platform.OS === 'android')
            Linking.openURL(`tel:${request.responder.mobileNumber}`)
        else if (Platform.OS === 'ios')
            Linking.openURL(`telprompt:${request.responder.mobileNumber}`)
    }

    const handleSubmitRateBtn = async () => {
        try {
            if (rate > 0) {
                const response = await rateRequest(request._id, rate)
                if (response.status == 200) {
                    setRequest(null)
                    navigation.goBack()
                    showToast("Your submission has been sent.")
                }
            }
            else showToast("Please rate your technician")
        } catch (error) {
            console.log(error.response);
            showToast(SMTH_WENT_WRONG)
        }
    }

    useEffect(() => {
        getCurrentLocation()
        socket.connect()

        if (id) {
            fetchRequest()
        }

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
                setResponderCoordinate(null)
            }
        })

        socket.on('request:responder-coord-update', payload => {
            console.log("updated", payload);
            setResponderCoordinate(payload)
        })

        socket.on('request:inProgress', payload => {
            setRequest(payload)
        })

        socket.on('request:notify-user', () => {
            setConfirmModalVisible(true)
        })
    }, [])

    useEffect(() => {
        if (mapRef) mapRef.current.fitToCoordinates([region, responderCoordinate])

    }, [responderCoordinate?.latitude, responderCoordinate?.longitude])


    useEffect(() => {
        pulseAnimation().start()
    }, [request?.state])

    return (
        <View style={styles.continer}>
            <CustomModal
                visible={ConfirmModalVisible}
                onRequestClose={() => setConfirmModalVisible(false)}
            >
                <PoppinsText>Confirm end of service</PoppinsText>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={styles.modalBtn} onPress={() => setConfirmModalVisible(false)}>
                        <PoppinsText style={{ color: '#D3D3D3' }}>Cancel</PoppinsText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalBtn} onPress={handleConfirmEndServiceBTN}>
                        <PoppinsText style={{ color: 'green' }}>Confirm</PoppinsText>
                    </TouchableOpacity>
                </View>
            </CustomModal>
            <MapView
                style={styles.map}
                provider='google'
                initialRegion={{ latitude: 30.0444, longitude: 31.2357, latitudeDelta: 0.004757, longitudeDelta: 0.006866 }}
                showsUserLocation
                followsUserLocation
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
                {(request && responderCoordinate) && <>
                    <MapViewDirections
                        apikey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}
                        destination={request.coordinates}
                        origin={responderCoordinate}
                        strokeColor={mainColor}
                        strokeWidth={4}
                    />
                    <Marker
                        coordinate={responderCoordinate}
                        image={techIcon}
                    >
                    </Marker>
                </>}
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
                            opacity: request.state === 'pending' ? 0 : request.state === 'responding' ? barOpacity : 1
                        }} />
                        <Animated.View style={{
                            ...styles.bar,
                            opacity: request.state === 'pending' || request.state === 'responding' ? 0 : request.state === 'inProgress' ? barOpacity : 1
                        }} />
                    </View>
                    {
                        request.state === 'pending' && <View style={{ alignItems: 'center' }}>
                            <PoppinsText style={styles.stateMessage}>Connecting you to a technician</PoppinsText>
                            {/* <Connecting /> */}
                        </View>
                    }
                    {
                        (request.state === 'inProgress' || request.state === 'responding' || request.state === 'done') && <>
                            <PoppinsText style={{ color: mainColor, fontSize: 25, padding: 8 }}>Technician info</PoppinsText>
                            <View style={styles.userInfo}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        source={request.responder?.profilePic?.length === 0 ?
                                            require('../assets/images/avatar.png') :
                                            { uri: request.responder.profilePic }
                                        }
                                        style={styles.profilePic}
                                    />
                                    <View>
                                        <PoppinsText style={{ fontSize: 18 }}>
                                            {request.responder.firstName} {request.responder.lastName}
                                        </PoppinsText>
                                        <PoppinsText style={styles.highLightedText}> {request.responder.mobileNumber} </PoppinsText>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={{ padding: 8, borderRadius: 50, backgroundColor: secondryColor }}
                                    onPress={handleCallBtn}>
                                    <MaterialIcons name="call" size={26} color={mainColor} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <MaterialIcons name="star" style={{ color: mainColor, fontSize: 25 }} />
                                <PoppinsText style={{ color: mainColor, fontSize: 20 }}> {request.responder.rate} </PoppinsText>
                            </View>
                        </>
                    }
                    {
                        request.state === 'cancelled' && <PoppinsText style={styles.stateMessage}>Your request has been cancelled</PoppinsText>
                    }
                    {
                        (request.state === 'pending' || request.state === 'responding') && <TouchableOpacity
                            style={{ ...styles.btn, backgroundColor: '#F9BFBF' }}
                            onPress={handleCancelRequestBtn}
                        >
                            <PoppinsText style={{ color: 'red' }}>Cancel</PoppinsText>
                        </TouchableOpacity>
                    }
                    {
                        request.state === 'inProgress' && <PoppinsText style={{ textAlign: "center" }}>Service started</PoppinsText>
                    }
                    {
                        (request.state === 'done' && !request.isResponderRated) && <>
                            <PoppinsText style={{ margin: 8, fontSize: 16 }}>Rate {request.responder.firstName}</PoppinsText>
                            <FlatList
                                data={RATES}
                                renderItem={({ item, index }) => <StarFlatListItem index={index} rate={rate} onPress={() => setRate(item)} />}
                                horizontal
                                keyExtractor={(item) => item}
                                contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
                                style={{ flexGrow: 0 }}
                                ItemSeparatorComponent={<View style={{ width: 5 }} />}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <TouchableOpacity
                                    style={{ ...styles.btn }}
                                    onPress={() => navigation.goBack()}
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
        backgroundColor: secondryColor,
        padding: 12,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    icon: {
        fontSize: 30,
        color: mainColor
    },
    bottomSheetContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    bar: {
        height: 4,
        backgroundColor: mainColor,
        marginHorizontal: 4,
        flex: 1,
        borderRadius: 4
    },
    barsView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        marginHorizontal: 8
    },
    btn: {
        borderRadius: 16,
        padding: 8,
        alignItems: 'center',
        marginTop: 8
    },
    stateMessage: {
        textAlign: 'center',
        marginBottom: 16
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginBottom: 12
    },
    profilePic: {
        height: 60,
        width: 60,
        borderRadius: 60,
        marginRight: 8
    },
    highLightedText: {
        color: "#878791"
    },
    modalBtn: {
        padding: 8
    }
})