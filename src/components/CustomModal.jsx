import { Modal, StyleSheet, View, TouchableWithoutFeedback } from 'react-native';

const CustomModal = ({ children, onRequestClose, visible }) => {
    const handleModalTap = () => {
        // Do nothing when tapped inside the modal
    };

    return (
        <Modal
            animationType='fade'
            onRequestClose={onRequestClose}
            transparent={true}
            visible={visible}
        >
            <TouchableWithoutFeedback onPress={onRequestClose}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback onPress={handleModalTap}>
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                {children}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default CustomModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        elevation: 5
    }
});
