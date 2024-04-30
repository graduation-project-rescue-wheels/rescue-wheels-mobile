import { Image, StyleSheet, View } from 'react-native'
import PoppinsText from './PoppinsText'

const RepairCenterListEmptyComponent = () => {
    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/technician.png')} style={styles.image} />
            <PoppinsText>This repair center doesn't have any listed technicians</PoppinsText>
        </View>
    )
}

export default RepairCenterListEmptyComponent

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    image: {
        height: 100,
        width: 100
    }
})