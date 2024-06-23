import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native'
import PoppinsText from './PoppinsText'
import { useEffect, useState } from 'react'
import { getVehicleById } from '../api/vehicle'
import { MaterialIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import CustomModal from './CustomModal'
import { useDispatch } from 'react-redux'
import { deleteVehicleAsync } from '../store/userAsyncThunks'
import { mainColor } from '../colors'

const VehicleFlatListItem = ({ id }) => {
    const [vehicle, setVehicle] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(false)
    const [confirmDeleteVehicleModalVisible, setConfirmDeleteVehicleModalVisible] = useState(false)
    const dispatch = useDispatch()

    const handleYesBtnOnPress = () => {
        dispatch(deleteVehicleAsync({ id, onRequestClose: () => setConfirmDeleteVehicleModalVisible(false) }))
    }

    async function fetchVehicleData() {
        try {
            setIsLoading(true)

            const res = await getVehicleById(id)

            setVehicle(res.data.vehicle)
            setError(false)
        } catch (err) {
            setError(true)
            console.log(err);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchVehicleData()
    }, [])

    return (
        <View style={styles.container}>
            <CustomModal
                visible={confirmDeleteVehicleModalVisible}
                onRequestClose={() => setConfirmDeleteVehicleModalVisible(false)}
            >
                <View style={styles.vehicleView}>
                    <PoppinsText style={styles.modalTitle}>Would like to remove this vehicle?</PoppinsText>
                    <View style={styles.flexRow}>
                        {
                            vehicle?.type === 'car' ?
                                <AntDesign name="car" style={styles.icon} /> : <MaterialIcons name="motorcycle" style={styles.icon} />
                        }
                        {
                            vehicle?.energySource === 'petrol' || vehicle?.energySource === 'diesel' ?
                                <MaterialCommunityIcons name="fuel" style={styles.icon} /> : <MaterialCommunityIcons name="ev-plug-type2" style={styles.icon} />
                        }
                    </View>
                    <View style={styles.flexRow}>
                        <PoppinsText>{`${vehicle?.make} ${vehicle?.model}`}</PoppinsText>
                        <PoppinsText>{vehicle?.licensePlate}</PoppinsText>
                    </View>
                </View>
                <View style={{ ...styles.flexRow, width: '100%' }}>
                    <TouchableOpacity style={styles.modalBtn} onPress={() => setConfirmDeleteVehicleModalVisible(false)}>
                        <PoppinsText style={{ color: 'red' }}>No</PoppinsText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalBtn} onPress={handleYesBtnOnPress}>
                        <PoppinsText style={{ color: 'green' }}>Yes</PoppinsText>
                    </TouchableOpacity>
                </View>
            </CustomModal>
            {
                isLoading ?
                    <ActivityIndicator size={'large'} color={mainColor} /> : error ?
                        <View style={styles.errorView}>
                            <MaterialIcons name='error-outline' style={styles.errorIcon} />
                            <PoppinsText style={styles.errorText}>Something went wrong</PoppinsText>
                        </View> : <View style={styles.vehicleView}>
                            <View style={styles.flexRow}>
                                {
                                    vehicle?.type === 'car' ?
                                        <AntDesign name="car" style={styles.icon} /> : <MaterialIcons name="motorcycle" style={styles.icon} />
                                }
                                {
                                    vehicle?.energySource === 'petrol' || vehicle?.energySource === 'diesel' ?
                                        <MaterialCommunityIcons name="fuel" style={styles.icon} /> : <MaterialCommunityIcons name="ev-plug-type2" style={styles.icon} />
                                }
                            </View>
                            <View style={styles.flexRow}>
                                <PoppinsText>{`${vehicle?.make} ${vehicle?.model}`}</PoppinsText>
                                <PoppinsText>{vehicle?.licensePlate}</PoppinsText>
                            </View>
                            <TouchableOpacity style={styles.deleteBtn} onPress={() => setConfirmDeleteVehicleModalVisible(true)}>
                                <AntDesign name='delete' style={{ ...styles.icon, color: 'red' }} />
                            </TouchableOpacity>
                        </View>
            }
        </View>
    )
}

export default VehicleFlatListItem

const styles = StyleSheet.create({
    container: {
        elevation: 5,
        margin: 8,
        borderRadius: 16,
        backgroundColor: 'white'
    },
    errorView: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8
    },
    errorIcon: {
        color: 'red',
        fontSize: 50
    },
    errorText: {
        color: 'red',
        fontSize: 20
    },
    vehicleView: {
        padding: 8
    },
    icon: {
        fontSize: 20
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    deleteBtn: {
        alignSelf: 'flex-end'
    },
    modalTitle: {
        fontSize: 16,
        marginBottom: 8
    },
    modalBtn: {
        padding: 8
    }
})