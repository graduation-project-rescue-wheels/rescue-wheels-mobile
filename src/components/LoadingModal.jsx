import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native'
import { mainColor } from '../colors'

const LoadingModal = ({ visible }) => {
    return (
        <Modal visible={visible} transparent={true}>
            <View style={styles.modalView}>
                <ActivityIndicator color={mainColor} size={'large'} />
            </View>
        </Modal>
    )
}

export default LoadingModal

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
})