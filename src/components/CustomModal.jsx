import { Modal, StyleSheet, View } from 'react-native'

const CustomModal = ({ children, onRequestClose, visible }) => {
    return (
        <Modal
            style={styles.container}
            animationType='fade'
            onRequestClose={onRequestClose}
            transparent={true}
            visible={visible}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {children}
                </View>
            </View>
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
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        elevation: 5
    },
})