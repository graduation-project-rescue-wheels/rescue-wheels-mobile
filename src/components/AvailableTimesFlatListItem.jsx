import { Pressable, StyleSheet, View } from 'react-native'
import PoppinsText from './PoppinsText'
import { mainColor, secondryColor } from '../colors'

const AvailableTimesFlatListItem = ({ item, onPress }) => {
    return (
        <Pressable onPress={onPress} style={styles.container}>
            <PoppinsText>{item.start.toLocaleTimeString()}</PoppinsText>
            <View style={{ height: 30, width: 2, backgroundColor: mainColor, borderRadius: 2, left: 5 }} />
            <PoppinsText>{item.end.toLocaleTimeString()}</PoppinsText>
        </Pressable>
    )
}

export default AvailableTimesFlatListItem

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        elevation: 5,
        padding: 8,
        backgroundColor: secondryColor,
        margin: 8
    }
})