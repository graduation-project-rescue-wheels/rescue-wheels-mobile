import { Modal, Pressable, StyleSheet, View } from 'react-native'

const CustomModal = ({ children, onRequestClose, visible }) => {
    return (
        <Modal
            style={styles.container}
            animationType='fade'
            onRequestClose={onRequestClose}
            transparent={true}
            visible={visible}
        >
            <Pressable style={styles.centeredView} onPress={onRequestClose}>
                <View style={styles.modalView}>
                    {children}
                </View>
            </Pressable>
        </Modal >
    )
}

export default CustomModal

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    modalView: {
        margin: 20,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        elevation: 5
    }
})