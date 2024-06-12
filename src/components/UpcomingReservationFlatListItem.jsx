import { StyleSheet, View } from 'react-native'
import { mainColor, secondryColor } from '../colors'
import PoppinsText from './PoppinsText'

const UpcomingReservationFlatListItem = ({ item }) => {
    return (
        <View style={styles.container}>
            <PoppinsText style={{ color: mainColor }}>{item.title}</PoppinsText>
            <PoppinsText style={{ color: '#ADADAD' }}>{item.description}</PoppinsText>
            <PoppinsText>{new Date(Date.parse(item.startDate)).toLocaleTimeString()}</PoppinsText>
            <View style={{ width: 2, height: 30, borderRadius: 2, backgroundColor: mainColor, left: 5 }} />
            <PoppinsText>{new Date(Date.parse(item.endDate)).toLocaleTimeString()}</PoppinsText>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{
                    backgroundColor: item.status === 'pending' ?
                        'yellow' : item.status === 'booked' ?
                            'green' : 'red',
                    height: 8,
                    width: 8,
                    borderRadius: 8,
                    marginRight: 4
                }} />
                <PoppinsText>{item.status}</PoppinsText>
            </View>
        </View>
    )
}

export default UpcomingReservationFlatListItem

const styles = StyleSheet.create({
    container: {
        elevation: 5,
        borderRadius: 16,
        padding: 8,
        backgroundColor: secondryColor,
        margin: 8,
        // width: '100%'
    }
})