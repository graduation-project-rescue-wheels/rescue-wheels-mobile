import { StyleSheet, View } from 'react-native'
import PoppinsText from './PoppinsText'
import { MaterialIcons } from '@expo/vector-icons'

const NoUpcomingReservations = () => {
    return (
        <View style={styles.container}>
            <MaterialIcons name='upcoming' style={styles.icon} />
            <PoppinsText style={styles.text}>You don't have any upcoming reservations</PoppinsText>
        </View>
    )
}

export default NoUpcomingReservations

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 16,
        flex: 1,
    },
    icon: {
        fontSize: 40,
        color: '#666666',
    },
    text: {
        color: '#666666'
    }
})