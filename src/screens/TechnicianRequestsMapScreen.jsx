import { Animated, Dimensions, Linking, Platform, StyleSheet, View } from 'react-native'
import * as Location from 'expo-location'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MapView, { Callout, Marker } from 'react-native-maps'
import { cancelResponder, getRequestById } from '../api/EmergencyRequest'
import PoppinsText from '../components/PoppinsText'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { MaterialIcons } from '@expo/vector-icons'
import { Fontisto } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { Ionicons } from "@expo/vector-icons"
import { acceptRequest } from '../api/user'

const { height } = Dimensions.get('window')

const TechnicianRequestsMapScreen = ({ route }) => {
    const [region, setRegion] = useState(null)
    const [request, setRequest] = useState(null)
    const [mapPadding, setMapPadding] = useState(85)

    const snappingPoints = useMemo(() => {
        return [0.28, 0.60].map(percentage => percentage * height);
    }, [height]); //Snapping points must be in an ascending order

    const mapRef = useRef()
    const bottomSheetRef = useRef();
    const markerRef = useRef();
    const myLocationBtnBottom = useRef(new Animated.Value(0)).current
    const barOpacity = useRef(new Animated.Value(1)).current

    const getCurrentLocationAndRequest = async () => {
        const perm = await Location.requestForegroundPermissionsAsync()

        if (perm.granted) {
            const location = await Location.getCurrentPositionAsync({})
            const requestData = await getRequestById('66043a5df5fabf87631c84e8')
            setRequest(requestData.data.request)
            setRegion({
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
                latitudeDelta: 0.004757,
                longitudeDelta: 0.006866
            })
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


    const handleAcceptBtn = async () => {
        const response = await acceptRequest(request._id)
        if (response.status == 200) {
            setRequest(response.data.request)
        }
    }

    useEffect(() => {
        getCurrentLocationAndRequest()
        pulseAnimation().start()
    }, [])

    useEffect(() => {
        if (request && region) {
            handleFocusMap()
        }
    }, [request?.state, region?.longitude])

    useEffect(() => {
        handleFocusMap()
    }, [mapPadding])

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
                        request === null ?
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
                            </View> :
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
                                    request.state === 'pending' || request.state === 'cancelled' ?
                                        <TouchableOpacity
                                            style={{ ...styles.btn, marginTop: 10, backgroundColor: '#E48700' }}
                                            onPress={handleAcceptBtn}>
                                            <PoppinsText style={styles.buttonText}>Accept request</PoppinsText>
                                        </TouchableOpacity> :
                                        <View>
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
                                                onPress={() => { cancelResponder(request._id) }}>
                                                <PoppinsText style={{ color: 'red' }}>Cancel</PoppinsText>
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
        fontSize: 60,
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