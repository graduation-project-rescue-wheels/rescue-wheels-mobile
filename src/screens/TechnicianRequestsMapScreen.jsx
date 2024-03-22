import { Animated, Dimensions, StyleSheet, View } from 'react-native'
import * as Location from 'expo-location'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import MapView, { Callout, Marker } from 'react-native-maps'
import { getRequestById } from '../api/EmergencyRequest'
import PoppinsText from '../components/PoppinsText'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { MaterialIcons } from '@expo/vector-icons'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { Ionicons } from "@expo/vector-icons"
import { acceptRequest } from '../api/user'

const { height } = Dimensions.get('window')

const TechnicianRequestsMapScreen = ({ route }) => {
    const [region, setRegion] = useState(null)
    const [request, setRequest] = useState(null)
    const [mapPadding, setMapPadding] = useState(85)

    const snappingPoints = useMemo(() => {
        return [0.28, 0.55].map(percentage => percentage * height);
    }, [height]); //Snapping points must be in an ascending order

    const mapRef = useRef()
    const bottomSheetRef = useRef();
    const myLocationBtnBottom = useRef(new Animated.Value(0)).current

    const getCurrentLocationAndRequest = async () => {
        const perm = await Location.requestForegroundPermissionsAsync()

        if (perm.granted) {
            const location = await Location.getCurrentPositionAsync({})
            const requestData = await getRequestById('65fcc6f380746317240f6200')

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
    }

    useEffect(() => {
        getCurrentLocationAndRequest()
    }, [])

    useEffect(() => {
        if (request && region) {
            handleFocusMap()
        }
    }, [request?.state, region?.longitude])

    useEffect(() => {
        handleFocusMap()
    }, [mapPadding])

    const handleAcceptBtn = () => {
        if (request) {
            acceptRequest(request._id)
        }
    }

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
                {request && <Marker coordinate={request.coordinates}>
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
            {request && <BottomSheet
                ref={bottomSheetRef}
                onChange={handleSheetChanges}
                snapPoints={snappingPoints}
                index={0}
            >
                <BottomSheetView style={styles.bottomSheetContainer}>
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
                    <TouchableOpacity
                        style={styles.acceptBTN}
                        onPress={handleAcceptBtn}>
                        <PoppinsText style={styles.buttonText}>Accept request</PoppinsText>
                    </TouchableOpacity>
                </BottomSheetView>
            </BottomSheet>}
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
    acceptBTN: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E48700',
        elevation: 5,
        padding: 10,
        marginTop: 10,
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

    }
})