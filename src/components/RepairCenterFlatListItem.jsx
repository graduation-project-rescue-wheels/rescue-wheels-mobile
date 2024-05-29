import { Image, Pressable, StyleSheet, View } from 'react-native'
import PoppinsText from './PoppinsText'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import MapView, { Marker } from 'react-native-maps'
import { mainColor } from '../colors'

const RepairCenterFlatListItem = ({ item, navigation }) => {
    return (
        <Pressable
            style={styles.container}
            onPress={() => navigation.navigate('selectedRc', { rc: item })}
        >
            <View style={{ borderRadius: 16, flexDirection: 'row' }}>
                <Image
                    source={item.Image?.secure_url ? { uri: item.Image?.secure_url } : require('../assets/images/RCAvatar.png')}
                    style={styles.image}
                />
                <MapView
                    provider='google'
                    scrollEnabled={false}
                    style={styles.map}
                    initialRegion={{
                        ...item.location.coords,
                        latitudeDelta: 0.006866,
                        longitudeDelta: 0.004757
                    }}
                >
                    <Marker coordinate={item.location.coords} />
                </MapView>
            </View>
            <View style={{ padding: 8 }}>
                <PoppinsText style={{ color: mainColor }}>{item.name}</PoppinsText>
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
                    <PoppinsText style={styles.info}>{item.location.address}</PoppinsText>
                </View>
            </View>
        </Pressable>
    )
}

export default RepairCenterFlatListItem

const styles = StyleSheet.create({
    container: {
        elevation: 5,
        borderRadius: 16,
        backgroundColor: '#fafafa',
        margin: 8,
        overflow: 'hidden'
    },
    image: {
        width: 90,
        height: 90,
        borderTopLeftRadius: 16,
        backgroundColor: 'white'
        // tintColor:'#d3d3d3'
    },
    map: {
        borderRadius: 16,
        height: 90,
        width: 290
    },
    info: {
        fontSize: 11,
        color: '#969696',
        marginRight: 8
    },
    icon: {
        color: '#969696',
        fontSize: 14,
        marginRight: 4
    },
    iconTextView: {
        flexDirection: 'row',
    }
})