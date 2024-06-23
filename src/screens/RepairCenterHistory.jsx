import { useEffect, useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { getUserReservationHistory } from '../api/reservation'
import showToast from '../components/Toast'
import PoppinsText from '../components/PoppinsText'
import ReservationHistoryFlatListItem from '../components/ReservationHistoryFlatListItem'

const RepairCenterHistory = () => {
    const [reservations, setReservations] = useState([])

    const fetchReservations = async () => {
        try {
            const response = await getUserReservationHistory()

            if (response.status === 200) {
                console.log(response.data.reservations);
                setReservations(response.data.reservations)
            }
        } catch (err) {
            console.log(err);
            showToast("Couldn't get your previous reservations. Try again later.")
        }
    }
    useEffect(() => {
        fetchReservations()
    }, [])

    return (
        <View style={styles.container}>
            <FlatList
                data={reservations}
                renderItem={({ item }) => <ReservationHistoryFlatListItem item={item} />}
                keyExtractor={(item, _) => item._id}
                ListFooterComponent={<View style={{ height: 85 }} />}
            />
        </View>
    )
}

export default RepairCenterHistory

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})