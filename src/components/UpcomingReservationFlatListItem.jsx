import { Pressable, StyleSheet, View } from 'react-native'
import { mainColor, secondryColor } from '../colors'
import PoppinsText from './PoppinsText'
import { useMemo } from 'react'

const UpcomingReservationFlatListItem = ({ item, onPress }) => {
    const startDate = useMemo(() => new Date(Date.parse(item.startDate)), [item.startDate])
    const endDate = useMemo(() => new Date(Date.parse(item.endDate)), [item.endDate])

    return (
        <Pressable style={styles.container} onPress={onPress}>
            <PoppinsText style={{ color: mainColor }} numberOfLines={1}>{item.title}</PoppinsText>
            <PoppinsText style={{ color: '#ADADAD', fontSize: 11 }} numberOfLines={1}>{item.description}</PoppinsText>
            <PoppinsText>{startDate.toLocaleDateString()} {startDate.toLocaleTimeString()}</PoppinsText>
            <View style={{ width: 2, height: 30, borderRadius: 2, backgroundColor: mainColor, left: 5 }} />
            <PoppinsText>{endDate.toLocaleDateString()} {endDate.toLocaleTimeString()}</PoppinsText>
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
        </Pressable>
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
        width: 200
    }
})