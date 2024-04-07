import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import SelectionButton from '../components/SelectionButton'
import { useEffect, useRef, useState } from 'react'
import { AntDesign, MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'
import { getVehicleById } from '../api/vehicle'
import CustomModal from '../components/CustomModal'
import PoppinsText from '../components/PoppinsText'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import * as Location from 'expo-location'
import { validateAddress, validateSelectedEmergency, validateSelectedVehicle } from '../utils/inputValidations'
import { requestEmergencyAsync } from '../store/userAsyncThunks'
import ValidationMessage from '../components/ValidationMessage'
import showToast from '../components/Toast'
import NoVehicles from '../components/NoVehicles'
import MapView, { Marker } from 'react-native-maps'

const EmergencyScreen = ({ navigation }) => {
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [selectedVehicle, setSelectedVehicle] = useState(null)
    const [selectedEmergency, setSelectedEmergency] = useState(null)
    const [selectedAddress, setSelectedAddress] = useState('')
    const [vehicles, setVehicles] = useState([])
    const [selectVehicleModalVisible, setSelectVehicleModalVisible] = useState(false)
    const [selectEmergencyModalVisible, setSelectEmergencyModalVisible] = useState(false)
    const [selectAdressModalVisible, setSelectAdressModalVisible] = useState(false)
    const [isLoadingVehicles, setIsLoadingVehicles] = useState(false)
    const [region, setRegion] = useState(null)
    const [vehicleValidation, setVehicleValidation] = useState({
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [emergencyValidation, setEmergencyValidation] = useState({
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [addressValidation, setAddressValidation] = useState({
        validation: {
            isValid: true,
            message: ''
        }
    })
    const [dropOffMarkerCoordinates, setDropOffMarkerCoordinates] = useState(null)

    const containerRef = useRef()
    const mapRef = useRef()

    const emergencies = [
        {
            label: 'Flat tire',
            Icon: () => <MaterialIcons name='tire-repair' style={{ ...styles.icon, color: 'black' }} />,
        },
        {
            label: 'Out of fuel/Dead battery',
            Icon: () => <MaterialCommunityIcons name='fuel-cell' style={{ ...styles.icon, color: 'black' }} />,
        },
        {
            label: 'Other',
            Icon: () => <MaterialCommunityIcons name='tow-truck' style={{ ...styles.icon, color: 'black' }} />
        }
    ]

    const fetchVehicles = async () => {
        try {
            setIsLoadingVehicles(true)

            const res = await Promise.all(user.vehicles_IDS.map(getVehicleById))
            const vehicles = res.map(e => e.data.vehicle)

            setVehicles(vehicles)
        } catch (err) {
            console.log(err);
            showToast("Couldn't load your vehicles")
        } finally {
            setIsLoadingVehicles(false)
        }
    }

    const handleRequestHelpBtnOnPress = async () => {
        const res = await Location.requestForegroundPermissionsAsync()
        const vehicleValidationResult = validateSelectedVehicle(selectedVehicle)
        const emergencyValidationResult = validateSelectedEmergency(selectedEmergency)

        setVehicleValidation({ validation: vehicleValidationResult })
        setEmergencyValidation({ validation: emergencyValidationResult })

        if (selectedEmergency.label === 'Other') {
            const addressValidationResult = validateAddress(selectedAddress)

            setAddressValidation({ validation: addressValidationResult })

            if (res.granted && vehicleValidationResult.isValid && emergencyValidationResult.isValid && addressValidationResult.isValid) {
                const location = await Location.getCurrentPositionAsync({})

                dispatch(requestEmergencyAsync({
                    vehicle: selectedVehicle._id,
                    coordinates: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude
                    },
                    type: selectedEmergency.label,
                    dropOffLocation: dropOffMarkerCoordinates,
                    navigation
                }))
            }
        } else {
            if (res.granted && vehicleValidationResult.isValid && emergencyValidationResult.isValid) {
                const location = await Location.getCurrentPositionAsync({})

                dispatch(requestEmergencyAsync({
                    vehicle: selectedVehicle._id,
                    coordinates: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude
                    },
                    type: selectedEmergency.label,
                    navigation
                }))
            }
        }
    }

    const handleNoVehicleOnPress = () => {
        navigation.navigate('Profile-stack', { screen: 'Your vehicles' })
        setSelectVehicleModalVisible(false)
    }

    const handleMyLocationBtn = () => {
        mapRef.current.animateToRegion(region)
    }

    const handleMapViewOnPress = async ({ nativeEvent }) => {
        setDropOffMarkerCoordinates(nativeEvent.coordinate)
        const address = await mapRef.current.addressForCoordinate(nativeEvent.coordinate)
        setSelectedAddress(`${address.name} - ${address.subAdministrativeArea}`)
    }

    const handleConfirmDropOffBtn = () => {
        if (!dropOffMarkerCoordinates) {
            Alert.alert('Invalid drop off', 'Please choose a drop off location either by searching or tapping the desired location on the map.', [
                {
                    text: 'OK',
                    style: 'default'
                }
            ])
            showToast("ksjvb")
        } else {
            setSelectAdressModalVisible(false)
        }
    }

    const handleGooglePlacesAutoCompleteOnPress = (data, details = null) => {
        setDropOffMarkerCoordinates({
            longitude: details.geometry.location.lng,
            latitude: details.geometry.location.lat
        })
        setSelectedAddress(data.structured_formatting.main_text)
    }

    const handleDropOffSelectionBtn = async () => {
        const locationPermission = await Location.requestForegroundPermissionsAsync()

        if (locationPermission.granted) {
            const location = await Location.getCurrentPositionAsync({})

            setRegion({
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
                latitudeDelta: 0.004757,
                longitudeDelta: 0.006866
            })
            setSelectAdressModalVisible(true)
        }
    }

    useEffect(() => {
        if (selectVehicleModalVisible) {
            fetchVehicles()
        }
    }, [selectVehicleModalVisible])

    useEffect(() => {
        if (dropOffMarkerCoordinates) {
            mapRef.current.fitToCoordinates([region, dropOffMarkerCoordinates])
        }
    }, [dropOffMarkerCoordinates?.longitude, dropOffMarkerCoordinates?.latitude])

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="always" ref={containerRef}>
            <CustomModal visible={selectVehicleModalVisible} onRequestClose={() => setSelectVehicleModalVisible(false)}>
                <PoppinsText style={styles.modalTitle}>Select vehicle</PoppinsText>
                <ScrollView style={{ flexGrow: 0 }}>
                    {isLoadingVehicles ?
                        <ActivityIndicator color={'#E48700'} size={'large'} /> : vehicles.length === 0 ?
                            <NoVehicles onPress={handleNoVehicleOnPress} /> :
                            vehicles.map(vehicle => (
                                <SelectionButton
                                    value={`${vehicle.make} ${vehicle.model}`}
                                    Icon={vehicle.type === 'car' ?
                                        () => <AntDesign name="car" style={styles.icon} /> :
                                        () => <MaterialIcons name="motorcycle" style={styles.icon} />
                                    }
                                    onPress={() => {
                                        setSelectedVehicle(vehicle)
                                        setSelectVehicleModalVisible(false)
                                    }}
                                    key={vehicle._id}
                                />
                            ))
                    }
                </ScrollView>
                <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={() => {
                        setSelectVehicleModalVisible(false)
                        setSelectedVehicle(null)
                    }}
                >
                    <PoppinsText style={styles.modalBtnText}>Cancel</PoppinsText>
                </TouchableOpacity>
            </CustomModal>
            <CustomModal visible={selectEmergencyModalVisible} onRequestClose={() => setSelectEmergencyModalVisible(false)}>
                <PoppinsText style={styles.modalTitle}>Select emergency</PoppinsText>
                <ScrollView style={{ flexGrow: 0 }}>
                    {
                        emergencies.map(em => (
                            <SelectionButton
                                Icon={em.Icon}
                                value={em.label}
                                onPress={() => {
                                    setSelectedEmergency(em)
                                    setSelectEmergencyModalVisible(false)
                                }}
                                key={em.label}
                            />
                        ))
                    }
                </ScrollView>
                <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={() => {
                        setSelectEmergencyModalVisible(false)
                        setSelectedEmergency(null)
                    }}
                >
                    <PoppinsText style={styles.modalBtnText}>Cancel</PoppinsText>
                </TouchableOpacity>
            </CustomModal>
            <Modal
                visible={selectAdressModalVisible}
                onRequestClose={() => {
                    setDropOffMarkerCoordinates(null)
                    setSelectedAddress(null)
                    setSelectAdressModalVisible(false)
                }}
                animationType='fade'
            >
                <MapView
                    style={{ flex: 1 }}
                    provider='google'
                    showsUserLocation
                    region={region}
                    onPress={handleMapViewOnPress}
                    ref={mapRef}
                    mapPadding={{ bottom: 90, top: 120, right: 70 }}
                    showsMyLocationButton={false}
                >
                    {dropOffMarkerCoordinates && <Marker coordinate={dropOffMarkerCoordinates} />}
                </MapView>
                <View style={styles.modalAbsoluteView}>
                    <GooglePlacesAutocomplete
                        placeholder='Drop off'
                        query={{
                            key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
                            language: 'en',
                            components: 'country:eg'
                        }}
                        suppressDefaultStyles
                        styles={{
                            container: styles.placesAutoCompleteContainer,
                            textInput: styles.placesAutoCompleteTestInput,
                            row: styles.placesAutoCompleteRow,
                            separator: styles.placesAutoCompleteSeparator
                        }}
                        onPress={handleGooglePlacesAutoCompleteOnPress}
                        textInputProps={{
                            cursorColor: '#E48700'
                        }}
                        fetchDetails
                    />
                </View>
                <View style={{ ...styles.modalAbsoluteView, bottom: 40 }}>
                    <TouchableOpacity
                        style={{ ...styles.btn, backgroundColor: '#E48700', flexDirection: 'row' }}
                        onPress={handleConfirmDropOffBtn}
                    >
                        <AntDesign name='checkcircleo' style={{ ...styles.icon, color: 'white' }} />
                        <PoppinsText style={{ color: 'white' }}>Confirm drop off location</PoppinsText>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.myLocationBtn} onPress={handleMyLocationBtn}>
                    <MaterialIcons name='my-location' style={{ color: 'white', fontSize: 30 }} />
                </TouchableOpacity>
            </Modal>
            <View style={styles.card}>
                <SelectionButton
                    placeholder={'Select vehicle'}
                    value={selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : ''}
                    Icon={selectedVehicle ?
                        selectedVehicle.type === 'car' ?
                            () => <AntDesign name="car" style={{ ...styles.icon, color: 'black' }} /> :
                            () => <MaterialIcons name="motorcycle" style={{ ...styles.icon, color: 'black' }} /> :
                        () => <AntDesign name='select1' style={styles.icon} />}
                    onPress={() => setSelectVehicleModalVisible(true)}
                    hasValidation={true}
                    state={vehicleValidation}
                />
                <ValidationMessage state={vehicleValidation} />
                <SelectionButton
                    placeholder={'Select Emergency'}
                    value={selectedEmergency ? selectedEmergency.label : ''}
                    Icon={selectedEmergency ? () => <selectedEmergency.Icon /> : () => <AntDesign name='select1' style={styles.icon} />}
                    onPress={() => setSelectEmergencyModalVisible(true)}
                    hasValidation={true}
                    state={emergencyValidation}
                />
                <ValidationMessage state={emergencyValidation} />
                {selectedEmergency?.label === 'Other' && <View>
                    <SelectionButton
                        placeholder={'Drop off'}
                        value={selectedAddress ? selectedAddress : ''}
                        Icon={() => <Ionicons name='location-outline' style={{ ...styles.icon, color: 'black' }} />}
                        onPress={handleDropOffSelectionBtn}
                        hasValidation={true}
                        state={addressValidation}
                    />
                    <ValidationMessage state={addressValidation} />
                </View>}
                {user.onGoingRequestId !== null ?
                    <TouchableOpacity
                        style={{ ...styles.btn, backgroundColor: '#E48700' }}
                        onPress={() => navigation.navigate('Map', { id: user.onGoingRequestId })}
                    >
                        <PoppinsText style={{ color: 'white' }}>Go to ongoing request</PoppinsText>
                    </TouchableOpacity> : <TouchableOpacity style={{ ...styles.btn, backgroundColor: '#F9BFBF' }} onPress={handleRequestHelpBtnOnPress}>
                        <PoppinsText style={{ color: 'red' }}>Request help</PoppinsText>
                    </TouchableOpacity>
                }
            </View>
        </ScrollView>
    )
}

export default EmergencyScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 8
    },
    card: {
        padding: 8,
        backgroundColor: '#F6EEE3',
        borderRadius: 16,
        elevation: 5,
        marginHorizontal: 8,
        marginBottom: 16,
        marginTop: 8
    },
    icon: {
        marginRight: 8,
        color: '#ADADAD',
        fontSize: 20
    },
    modalTitle: {
        fontSize: 16
    },
    modalBtnText: {
        fontSize: 14,
        color: '#ADADAD'
    },
    modalBtn: {
        padding: 8
    },
    btn: {
        alignItems: 'center',
        padding: 8,
        borderRadius: 16,
        justifyContent: 'center',
    },
    placesAutoCompleteContainer: {
        padding: 8,
        backgroundColor: 'white',
        marginVertical: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ADADAD',
        width: '100%'
    },
    placesAutoCompleteTestInput: {
        borderBottomWidth: 1,
        borderBottomColor: '#ADADAD',
        marginBottom: 8,
        paddingBottom: 8
    },
    placesAutoCompleteRow: {
        paddingVertical: 8
    },
    placesAutoCompleteSeparator: {
        borderBottomColor: '#ADADAD',
        borderBottomWidth: 1
    },
    modalAbsoluteView: {
        position: 'absolute',
        width: '100%',
        paddingHorizontal: 8
    },
    myLocationBtn: {
        backgroundColor: '#E48700',
        padding: 12,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        position: 'absolute',
        bottom: 100,
        right: 16
    }
})