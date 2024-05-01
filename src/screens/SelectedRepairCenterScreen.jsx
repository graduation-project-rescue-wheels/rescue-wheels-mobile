import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Dimensions, FlatList, Linking, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import MapView, { Callout, Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import PoppinsText from '../components/PoppinsText'
import RepairCenterListEmptyComponent from '../components/RepairCenterListEmptyComponent'

const { height } = Dimensions.get('window')

const SelectedRepairCenterScreen = ({ route, navigation }) => {
    const { rc } = route.params

    const [location, setLocation] = useState(null)
    const [mapPadding, setMapPadding] = useState(85)

    const mapRef = useRef()
    const markerRef = useRef()
    const myLocationBtnBottom = useRef(new Animated.Value(0)).current

    const snappingPoints = useMemo(() => {
        return [0.35, 1].map(percentage => percentage * height);
    }, [height]); //Snapping points must be in an ascending order

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
        const permission = await Location.getForegroundPermissionsAsync()

        if (permission.granted) {
            const location = await Location.getCurrentPositionAsync()

            setLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                longitudeDelta: 0.006866,
                latitudeDelta: 0.004757
            })
        }
    }

    const handleMyLocationBtn = () => {
        mapRef.current.animateToRegion(location)
    }

    const handleCallBtn = () => {
        if (Platform.OS === 'android')
            Linking.openURL(`tel:${rc.phoneNumber}`)
        else if (Platform.OS === 'ios')
            Linking.openURL(`telprompt:${rc.phoneNumber}`)
    }

    const openGPS = () => {
        if (Platform.OS == 'android') {
            Linking.openURL(`google.navigation:q=${rc.location.coords.latitude},${rc.location.coords.longitude}`)
        } else if (Platform.OS == 'ios') {
            Linking.openURL(`maps://app?saddr=${location.latitude},${location.longitude}&daddr=${rc.location.coords.latitude},${rc.location.coords.longitude}`)
        }
    }

    useEffect(() => {
        navigation.setOptions({
            title: rc.name
        })
        getCurrentLocation()
        console.log(rc);
    }, [])

    useEffect(() => {

        if (mapRef) 
            mapRef.current.fitToCoordinates([location, rc.location.coords])
    }, [mapRef, location])

    useEffect(() => {
        markerRef.current?.showCallout()
    }, [markerRef.current])
    

    return (
        <View style={styles.container}>
            <MapView
                style={{ flex: 1 }}
                mapPadding={{ bottom: mapPadding }}
                showsUserLocation
                showsMyLocationButton={false}
                initialRegion={location}
                ref={mapRef}
                provider='google'
            >
                <Marker
                    coordinate={rc.location.coords}
                    ref={markerRef}
                >
                    <Callout>
                        <PoppinsText>{rc.name}</PoppinsText>
                    </Callout>
                </Marker>
            </MapView>
            <Animated.View style={{ bottom: snappingPoints[0] / 3, transform: [{ translateY: myLocationBtnBottom }], ...styles.myLocationBtnView }}>
                <TouchableOpacity style={styles.myLocationBtn} onPress={handleMyLocationBtn}>
                    <MaterialIcons name='my-location' style={styles.icon} />
                </TouchableOpacity>
            </Animated.View>
            <BottomSheet
                snapPoints={snappingPoints}
                index={0}
                onChange={handleSheetChanges}
            >
                <BottomSheetView style={styles.bottomSheetContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <View>
                            <PoppinsText style={styles.title}>{rc.name}</PoppinsText>
                            <PoppinsText style={styles.description}>{rc.description}</PoppinsText>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={{ ...styles.btn, marginRight: 8 }}
                                onPress={handleCallBtn}>
                                <MaterialIcons name="call" size={26} color='white' />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.btn}
                                onPress={openGPS}
                            >
                                <MaterialCommunityIcons name='map-marker' size={26} color={'white'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <PoppinsText style={{ fontSize: 16 }}>Technicians</PoppinsText>
                    <FlatList
                        data={rc.Technicians}
                        ListEmptyComponent={<RepairCenterListEmptyComponent />}
                    />
                </BottomSheetView>
            </BottomSheet>
        </View>
    )
}

export default SelectedRepairCenterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
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
        paddingHorizontal: 8
    },
    title: {
        color: '#E48700',
        fontSize: 20
    },
    btn: {
        padding: 8,
        borderRadius: 50,
        backgroundColor: '#E48700'
    },
    description: {
        color: '#969696'
    }
})