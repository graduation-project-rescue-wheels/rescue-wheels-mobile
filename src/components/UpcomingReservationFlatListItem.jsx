import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native'
import { mainColor, secondryColor } from '../colors'
import PoppinsText from './PoppinsText'
import { useMemo, useState } from 'react'
import CustomModal from './CustomModal'
import { cancelReservation } from '../api/reservation'
import showToast from './Toast'

const UpcomingReservationFlatListItem = ({ item, onPress, showCancelBTN, onCancelCallBack }) => {
    const startDate = useMemo(() => new Date(Date.parse(item.startDate)), [item.startDate])
    const endDate = useMemo(() => new Date(Date.parse(item.endDate)), [item.endDate])
    const [confirmModalVisible, setConfirmModalVisible] = useState(false)

    const handleCancelReservation = async () => {
        const response = await cancelReservation(item._id)
        if (response.status == 200) {
            setConfirmModalVisible(false)
            onCancelCallBack()
            showToast("Your reservation is cancelled successfully")
        }
    }

    return (
        <View>
            <CustomModal
                visible={confirmModalVisible}
                onRequestClose={() => setConfirmModalVisible(false)}
            >
                <PoppinsText>Confirm reservation cancelation</PoppinsText>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={{padding: 8}} onPress={() => setConfirmModalVisible(false)}>
                        <PoppinsText style={{ color: '#D3D3D3' }}>Cancel</PoppinsText>
                    </TouchableOpacity>
                    <TouchableOpacity style={{padding: 8}} onPress={handleCancelReservation}>
                        <PoppinsText style={{ color: 'green' }}>Confirm</PoppinsText>
                    </TouchableOpacity>
                </View>
            </CustomModal>
            <Pressable style={styles.container} onPress={onPress}>
                <PoppinsText style={{ color: mainColor }} numberOfLines={1}>{item.title}</PoppinsText>
                <PoppinsText style={{ color: '#ADADAD', fontSize: 11 }} numberOfLines={1}>{item.description}</PoppinsText>
                <PoppinsText>{startDate.toLocaleDateString()} {startDate.toLocaleTimeString()}</PoppinsText>
                <View style={{ width: 2, height: 30, borderRadius: 2, backgroundColor: mainColor, left: 5 }} />
                <PoppinsText>{endDate.toLocaleDateString()} {endDate.toLocaleTimeString()}</PoppinsText>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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
                    {
                        showCancelBTN && <TouchableOpacity onPress={() => setConfirmModalVisible(true)}>
                            <PoppinsText style={{ color: 'red' }}>Cancel</PoppinsText>
                        </TouchableOpacity>
                    }
                </View>
            </Pressable>
        </View>
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