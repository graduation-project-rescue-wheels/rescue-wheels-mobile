import { StyleSheet, View } from 'react-native'
import * as Location from 'expo-location'
import { useEffect, useState } from 'react'
import MapView, { Callout, Marker } from 'react-native-maps'
import { getRequestById } from '../api/EmergencyRequest'
import PoppinsText from '../components/PoppinsText'


const TechnicianRequestsMapScreen = ({ route }) => {
    const [region, setRegion] = useState(null)
    const [request, setRequest] = useState(null)
    // const { id } = route.params
    // console.log(id);
    const getCurrentLocation = async () => {
        const perm = await Location.requestForegroundPermissionsAsync()
        const location = await Location.getCurrentPositionAsync({})
        console.log(location.coords);

        if (perm.granted) {
            setRegion({
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.01
            })
        }
    }

    const getRequests = async () => {
        const request = await getRequestById('65f5ff896fb047a8215e2e1e')
        setRequest(request.data.request)
        console.log("the request", request.data.request)
    }

    useEffect(() => {
        getCurrentLocation()
        getRequests()
    }, [])


    return (
        <View style={styles.continer}>
            <MapView
                style={styles.map}
                provider='google'
                initialRegion={region}
                showsUserLocation={true}
                showsMyLocationButton
                zoomEnabled={true}
            >
                {request != null && <Marker
                    coordinate={{
                        longitude: request.coordinates.longitude,
                        latitude: request.coordinates.latitude,
                    }}
                    title={request.type}>
                    {/* <Callout>
                        <PoppinsText>Who are you</PoppinsText>
                    </Callout> */}
                </Marker>}
            </MapView>
        </View>
    )
}

export default TechnicianRequestsMapScreen

const styles = StyleSheet.create({
    continer: {
        flex: 1
    },
    map: {
        flex: 1
    }
})