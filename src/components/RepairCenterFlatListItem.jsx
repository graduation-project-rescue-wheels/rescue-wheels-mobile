import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import PoppinsText from './PoppinsText'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import MapView, { Marker } from 'react-native-maps'
import { useEffect, useRef } from 'react'

const RepairCenterFlatListItem = ({ item, navigation }) => {

    const mapRef = useRef()

    useEffect(() => {
        if (mapRef) {
            mapRef.current.animateToRegion({
                ...item.location.coords,
                latitudeDelta: 0.006866,
                longitudeDelta: 0.004757
            })
        }
    }, [mapRef])


    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate('selectedRc', { rc: item })}
        >
            <View style={{ borderRadius: 16, flexDirection: 'row' }}>
                <Image
                    source={item.photoURL ? { uri: item.photoURL } : require('../assets/images/RCAvatar.png')}
                    style={styles.image}
                />
                <MapView
                    provider='google'
                    scrollEnabled={false}
                    ref={mapRef}
                    style={styles.mapImage}>
                    <Marker
                        coordinate={item.location.coords}
                    >
                    </Marker>
                </MapView>
            </View>
            <View style={{ padding: 8 }}>
                <PoppinsText style={{ color: '#E48700' }}>{item.name}</PoppinsText>
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
        </TouchableOpacity>
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
    mapImage: {
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