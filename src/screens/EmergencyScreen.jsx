import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import SelectionButton from '../components/SelectionButton'
import { useEffect, useState } from 'react'
import { AntDesign, MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'
import { getVehicleById } from '../api/vehicle'
import CustomModal from '../components/CustomModal'
import PoppinsText from '../components/PoppinsText'
import CustomTextInput from '../components/CustomTextInput'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import * as Location from 'expo-location'
import { validateSelectedEmergency, validateSelectedVehicle } from '../utils/inputValidations'
import { requestEmergencyAsync } from '../store/userAsyncThunks'
import ValidationMessage from '../components/ValidationMessage'
import { getRequestById } from '../api/EmergencyRequest'

const EmergencyScreen = ({ navigation }) => {
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [selectedVehicle, setSelectedVehicle] = useState(null)
    const [selectedEmergency, setSelectedEmergency] = useState(null)
    const [vehicles, setVehicles] = useState([])
    const [selectVehicleModalVisible, setSelectVehicleModalVisible] = useState(false)
    const [selectEmergencyModalVisible, setSelectEmergencyModalVisible] = useState(false)
    const [address, setAddress] = useState({
        value: '',
        isFocused: false
    })
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
    const [pendingRequest, setPendingRequest] = useState(null)
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
        const res = await Promise.all(user.vehicles_IDS.map(getVehicleById))
        const vehicles = res.map(e => e.data.vehicle)

        setVehicles(vehicles)
    }

    const fetchEmergencyRequests = async () => {
        const res = await Promise.all(user.Requests_IDS.map(getRequestById))
        const requests = res.map(e => e.data.request)

        for (let i = 0; i < requests.length; i++) {
            if (requests[i].state === 'pending') {
                setPendingRequest(requests[i])
                break
            }
        }
    }

    const handleRequestHelpBtnOnPress = async () => {
        const res = await Location.requestForegroundPermissionsAsync()
        const vehicleValidationResult = validateSelectedVehicle(selectedVehicle)
        const emergencyValidationResult = validateSelectedEmergency(selectedEmergency)

        setVehicleValidation({ validation: vehicleValidationResult })
        setEmergencyValidation({ validation: emergencyValidationResult })

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

    useEffect(() => {
        fetchVehicles()
        fetchEmergencyRequests()
    }, [])

    return (
        <ScrollView style={styles.container}>
            <CustomModal visible={selectVehicleModalVisible} onRequestClose={() => setSelectVehicleModalVisible(false)}>
                <PoppinsText style={styles.modalTitle}>Select vehicle</PoppinsText>
                <ScrollView style={{ flexGrow: 0 }}>
                    {
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
                {
                    selectedEmergency?.label === 'Other' &&
                    <GooglePlacesAutocomplete
                        placeholder='Drop off'
                    />
                }
                {pendingRequest ?
                    <TouchableOpacity
                        style={{ ...styles.btn, backgroundColor: '#E48700' }}
                        onPress={() => navigation.navigate('Map', { id: pendingRequest._id })}
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
    }
})