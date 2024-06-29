import { Pressable, StyleSheet } from 'react-native'
import { mainColor, secondryColor } from '../colors'
import PoppinsText from './PoppinsText'

const OfferFlatlistItem = ({ item, onPress }) => {
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <PoppinsText style={styles.title}>{item.title}</PoppinsText>
            <PoppinsText style={styles.description}>{item.Desc}</PoppinsText>
        </Pressable>
    )
}

export default OfferFlatlistItem

const styles = StyleSheet.create({
    container: {
        elevation: 5,
        borderRadius: 16,
        padding: 8,
        backgroundColor: secondryColor,
        margin: 8,
        width: 200
    },
    title: {
        color: mainColor,
        fontSize: 16
    },
    description: {
        color: '#666666',
        fontSize: 12
    }
})