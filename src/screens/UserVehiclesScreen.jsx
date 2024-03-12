import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native'
import NoVehicles from '../components/NoVehicles'
import AddVehicleModal from '../components/AddVehicleModal'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import VehicleFlatListItem from '../components/VehicleFlatListItem'
import { AntDesign } from '@expo/vector-icons'
import { loadUserAsync } from '../store/userAsyncThunks'

const UserVehiclesScreen = () => {
    const { user } = useSelector(state => state.user)
    const [addVehicleModalVisible, setAddVehicleModalVisible] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const dispatch = useDispatch()

    const onRefresh = async () => {
        setIsRefreshing(true)
        dispatch(loadUserAsync())
        setIsRefreshing(false)
    }

    return (
        <View style={styles.container}>
            <AddVehicleModal visible={addVehicleModalVisible} onRequestClose={() => setAddVehicleModalVisible(false)} />
            <FlatList
                style={{ flex: 1 }}
                data={user.vehicles_IDS}
                renderItem={({ item }) => <VehicleFlatListItem id={item} />}
                ListEmptyComponent={<NoVehicles onPress={() => setAddVehicleModalVisible(true)} />}
                refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={['#E48700']} />}
            />
            <TouchableOpacity style={styles.addBtn} onPress={() => setAddVehicleModalVisible(true)}>
                <AntDesign
                    name='plus'
                    style={styles.addBtnIcon}
                />
            </TouchableOpacity>
        </View>
    )
}

export default UserVehiclesScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    addBtn: {
        position: 'absolute',
        backgroundColor: '#E48700',
        padding: 8,
        borderRadius: 50,
        bottom: 85,
        right: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5
    },
    addBtnIcon: {
        fontSize: 40,
        color: 'white'
    }
})