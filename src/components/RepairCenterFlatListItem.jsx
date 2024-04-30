import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import PoppinsText from './PoppinsText'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'

const RepairCenterFlatListItem = ({ item, navigation }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate('selectedRc', { rc: item })}
        >
            <Image
                source={item.photoURL ? { uri: item.photoURL } : require('../assets/images/RCAvatar.png')}
                style={styles.image}
            />
            <View>
                <PoppinsText>{item.name}</PoppinsText>
                <View style={styles.iconTextView}>
                    <Feather name='info' style={styles.icon} />
                    <PoppinsText style={styles.info}>{item.description}</PoppinsText>
                </View>
                <View style={styles.iconTextView}>
                    <Feather name='phone' style={styles.icon} />
                    <PoppinsText style={styles.info}>{item.phoneNumber}</PoppinsText>
                </View>
                <View style={styles.iconTextView}>
                    <MaterialCommunityIcons name='map-marker-outline' style={styles.icon} />
                    <PoppinsText style={styles.info}>{item.address}</PoppinsText>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default RepairCenterFlatListItem

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        elevation: 5,
        borderRadius: 16,
        backgroundColor: 'white',
        margin: 8
    },
    image: {
        width: 90,
        height: 90,
        marginRight: 8,
        borderRadius: 16,
        // tintColor:'#d3d3d3'
    },
    info: {
        fontSize: 11,
        color: '#D3D3D3'
    },
    icon: {
        color: '#d3d3d3',
        fontSize: 14,
        marginRight: 4
    },
    iconTextView: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})