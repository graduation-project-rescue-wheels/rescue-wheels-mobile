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
// import MapViewDirections from 'react-native-maps-directions'

const { height } = Dimensions.get('window')

const TechnicianRequestsMapScreen = ({ route }) => {
    const [region, setRegion] = useState(null)
    const [request, setRequest] = useState(null)
    const [user, setuser] = useState(null)
    const [vehicle, setVehicles] = useState(null)
    const [coords, setCoords] = useState([])
    const [index, setIndex] = useState(0)

    const snappingPoints = useMemo(() => {
        return [0.25, 0.52].map(percentage => percentage * height);
    }, [height]); //Snapping points must be in an ascending order

    const mapRef = useRef()
    const bottomSheetRef = useRef();
    const myLocationBtnBottom = useRef(new Animated.Value(0)).current

    const getCurrentLocation = async () => {
        const perm = await Location.requestForegroundPermissionsAsync()
        const location = await Location.getCurrentPositionAsync({})

        if (perm.granted) {
            setRegion({
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.01
            })
        }
    }

    const getRequests = async () => {
        const requestData = await getRequestById('65f5ff896fb047a8215e2e1e')
        setRequest(requestData.data.request)
        setuser(requestData.data.request.requestedBy)
        setVehicles(requestData.data.request.vehicle)
        setCoords([
            region,
            requestData.data.request.coordinates
        ])
    }

    const handleSheetChanges = useCallback(index => {
        Animated.spring(myLocationBtnBottom, {
            toValue: -snappingPoints[index],
            useNativeDriver: true
        }).start()
        setIndex(index)
    }, [])

    const focusMap = () => {
        mapRef.current.fitToCoordinates(coords)
    }

    const handleMyLocationBtn = () => {
        mapRef.current.animateToRegion(region)
    }

    const handleAcceptBtn = () => {
        setRequest({ ...request, state: 'inProgress' })
    }

    useEffect(() => {
        getCurrentLocation()
        getRequests()
    }, [])

    useEffect(() => {
        focusMap()
        console.log("aasd", index);
    }, [coords, index])

    return (
        <View style={styles.continer}>
            <MapView
                style={styles.map}
                provider='google'
                initialRegion={region}
                showsUserLocation
                showsMyLocationButton={false}
                ref={mapRef}
                mapPadding={{ bottom: snappingPoints[index] }}
            >
                {request != null && <Marker
                    coordinate={{
                        longitude: request.coordinates.longitude,
                        latitude: request.coordinates.latitude,
                    }}>
                    <Callout>
                        <PoppinsText>{request.type}</PoppinsText>
                    </Callout>
                </Marker>}
                {/* <MapViewDirections
                    origin={region}
                    destination={{
                        longitude: request.coordinates.longitude,
                        latitude: request.coordinates.latitude,
                    }}
                    apikey="YOUR_GOOGLE_MAPS_API_KEY_HERE"
                    strokeWidth={4}
                    strokeColor="red"
                /> */}
            </MapView>
            <Animated.View style={{ bottom: snappingPoints[0] / 2, transform: [{ translateY: myLocationBtnBottom }] }}>
                <TouchableOpacity style={styles.myLocationBtn} onPress={handleMyLocationBtn}>
                    <MaterialIcons name='my-location' style={styles.icon} />
                </TouchableOpacity>
            </Animated.View>
            {request && user && vehicle && <BottomSheet
                ref={bottomSheetRef}
                onChange={handleSheetChanges}
                snapPoints={snappingPoints}
                index={0}
            >
                <BottomSheetView style={styles.bottomSheetContainer}>
                    <PoppinsText style={{ color: '#E48700', fontSize: 25, padding: 8 }}>
                        Request details
                    </PoppinsText>
                    <View style={{ flexDirection: 'row' }}>
                        {
                            user.photoURL === undefined ?
                                <Ionicons
                                    name='person-circle-outline'
                                    style={styles.profilePic}
                                /> : <Image
                                    source={{ uri: user.photoPic }}
                                    style={styles.profilePic}
                                />
                        }
                        <View>
                            <PoppinsText style={{ fontSize: 18 }}>
                                {user.firstName} {user.lastName}
                            </PoppinsText>
                            <PoppinsText style={styles.highLightedText}> {user.mobileNumber} </PoppinsText>
                        </View>
                    </View>
                    <View style={{ ...styles.requestInfo, paddingTop: 30 }}>
                        <PoppinsText style={styles.highLightedText}>Emergency</PoppinsText>
                        <PoppinsText>{request.type}</PoppinsText>
                    </View>
                    <View style={styles.requestInfo}>
                        <PoppinsText style={styles.highLightedText}>Car model</PoppinsText>
                        <PoppinsText>{vehicle.make} {vehicle.model}</PoppinsText>
                    </View>
                    <View style={styles.requestInfo}>
                        <PoppinsText style={styles.highLightedText}>Car number</PoppinsText>
                        <PoppinsText>{vehicle.licensePlate}</PoppinsText>
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
        position: 'absolute',
        backgroundColor: '#E48700',
        padding: 12,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
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
    }

})