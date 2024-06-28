import { Image, StyleSheet, View } from 'react-native'
import PoppinsText from './PoppinsText';
import { useMemo } from 'react';
import { mainColor } from '../colors';

const ReservationHistoryFlatListItem = ({ item }) => {
    const date = useMemo(() => new Date(Date.parse(item.startDate)).toLocaleString(), [])
    console.log(item);
    return (
        <View style={styles.container}>
            <Image
                source={item.RepairCenterId?.Image?.secure_url ? { uri: item.RepairCenterId?.Image?.secure_url } : require('../assets/images/RCAvatar.png')}
                style={{ width: 100, height: 100, marginRight: 8 }}
                resizeMode='cover'
            />
            <View>
                <PoppinsText style={{ color: mainColor }}>{item.RepairCenterId?.name}</PoppinsText>
                <PoppinsText style={{ fontSize: 12 }}>{item.title}</PoppinsText>
                <PoppinsText style={styles.description}>{item.description}</PoppinsText>
                <PoppinsText style={styles.description}>{date}</PoppinsText>
            </View>
        </View>
    )
}

export default ReservationHistoryFlatListItem

const styles = StyleSheet.create({
    container: {
        elevation: 5,
        borderRadius: 16,
        backgroundColor: 'white',
        margin: 8,
        paddingRight: 8,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden'
    },
    description: {
        color: '#ADADAD',
        fontSize: 12
    }
})