import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import CustomModal from './CustomModal'
import PoppinsText from './PoppinsText'
import * as Location from 'expo-location'

const RequestBackgroundLocationAccesModal = ({ onRequestClose, visible }) => {
    const handlePermissionBtn = async () => {
        const permission = await Location.requestBackgroundPermissionsAsync()

        if (permission.granted) onRequestClose()
    }

    return (
        <CustomModal onRequestClose={onRequestClose} visible={visible}>
            <PoppinsText style={styles.title}>Background location access permission</PoppinsText>
            <PoppinsText style={{ marginBottom: 8 }}>Background location access is needed to help the user track your location.</PoppinsText>
            <PoppinsText>Please set the location access to "Allow all the time" as shown below:</PoppinsText>
            <Image
                source={require('../assets/images/allow-all-time-location-permission.jpg')}
                style={styles.image}
                resizeMode='cover'
                borderRadius={16}
            />
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={onRequestClose} style={styles.btn}>
                    <PoppinsText style={{ color: '#D3D3D3' }}>Cancel</PoppinsText>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePermissionBtn} style={styles.btn}>
                    <PoppinsText style={{ color: 'green' }}>Ok</PoppinsText>
                </TouchableOpacity>
            </View>
        </CustomModal>
    )
}

export default RequestBackgroundLocationAccesModal

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        marginBottom: 8
    },
    image: {
        height: 300,
        width: 300,
        borderRadius: 16,
        marginVertical: 8
    },
    btn: {
        padding: 8
    }
})