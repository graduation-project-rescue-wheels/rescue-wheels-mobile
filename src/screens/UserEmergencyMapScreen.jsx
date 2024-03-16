import { StyleSheet, View } from 'react-native'
import MapView, { Callout, Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import { useEffect, useState } from 'react'
import PoppinsText from '../components/PoppinsText'

const UserEmergencyMapScreen = ({ route }) => {
    const [region, setRegion] = useState(null)
    const { id } = route.params
    console.log(id);

    const getCurrentLocation = async () => {
        const location = await Location.getCurrentPositionAsync({})
        console.log(location.coords);

        setRegion({
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.01
        })
    }

    useEffect(() => {
        getCurrentLocation()
    }, [])

    return (
        <View style={styles.continer}>
            <MapView
                style={styles.map}
                provider='google'
                initialRegion={region}
                showsUserLocation
            >
                {/* {region && <Marker coordinate={{
                    latitude: region.latitude,
                    longitude: region.longitude
                }}>
                    <Callout>
                        <PoppinsText>I'm here</PoppinsText>
                    </Callout>
                </Marker>} */}
            </MapView>
        </View>
    )
}

export default UserEmergencyMapScreen

const styles = StyleSheet.create({
    continer: {
        flex: 1
    },
    map: {
        flex: 1
    }
})