import { useEffect, useState } from 'react'
import MapView, { Marker } from 'react-native-maps'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import showToast from '../components/Toast'
import { useSelector } from 'react-redux'
import { mainColor, secondryColor } from '../colors'
import PoppinsText from '../components/PoppinsText'
import { MaterialCommunityIcons, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getAddress } from '../utils/locations'

const SelectedHistoryScreen = ({ route }) => {
  const { user } = useSelector(state => state.user)
  const { item } = route.params
  const [address, setAddress] = useState('')
  const [dateAndTime, setDateAndTime] = useState('')

  const fetchData = async () => {
    try {
      const date = new Date(item.createdAt)
      getAddress(item.coordinates).then(address => {
        setAddress(address.data.results[0].formatted_address)
      })
      setDateAndTime(`${date.toDateString()} ${date.toLocaleTimeString()}`)
    } catch (err) {
      console.log(err);
      showToast("Couldn't get request data")
    }
  }

  const handleReportBtn = () => {
    /*todo*/
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          showsUserLocation
          showsMyLocationButton={false}
          region={{
            ...item.coordinates,
            latitudeDelta: 0.006866,
            longitudeDelta: 0.004757
          }}
          provider='google'
          scrollEnabled={false}
        >
          <Marker
            coordinate={item.coordinates}
          >
          </Marker>
        </MapView>
      </View>
      <View>
        {
          user.role === "Technician" && <View>
            <PoppinsText style={{ color: mainColor, fontSize: 25, padding: 8 }}>
              Request history details
            </PoppinsText>
            <PoppinsText style={{ color: mainColor, fontSize: 16, margin: 8 }}>Client information</PoppinsText>
            <View style={styles.userInfo}>
              <Image
                source={item.requestedBy.profilePic.length === 0 ?
                  require('../assets/images/avatar.png') :
                  { uri: item.requestedBy.profilePic }
                }
                style={styles.profilePic}
              />
              <View>
                <PoppinsText style={{ fontSize: 18 }}>
                  {item.requestedBy.firstName} {item.requestedBy.lastName}
                </PoppinsText>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name='star' style={{ fontSize: 16, color: mainColor }} />
                  <PoppinsText style={styles.highLightedText}> {item.requestedBy.rate} </PoppinsText>
                </View>
              </View>
            </View>
          </View>
        }
        {
          user.role === "User" && <View>
            <PoppinsText style={{ color: mainColor, fontSize: 25, padding: 8 }}>
              Request history details
            </PoppinsText>
            <PoppinsText style={{ color: mainColor, fontSize: 16, margin: 8 }}>Technician information</PoppinsText>
            <View style={styles.userInfo}>
              <Image
                source={item.responder.profilePic.length === 0 ?
                  require('../assets/images/avatar.png') :
                  { uri: item.responder.profilePic }
                }
                style={styles.profilePic}
              />
              <View>
                <PoppinsText style={{ fontSize: 18 }}>
                  {item.responder.firstName} {item.responder.lastName}
                </PoppinsText>
                <PoppinsText style={styles.highLightedText}> {item.responder.rate} </PoppinsText>
              </View>
            </View>
          </View>
        }
        <PoppinsText style={{ color: mainColor, fontSize: 16, marginTop: 12, marginHorizontal: 8 }}>Request information</PoppinsText>
        <View>
          <View style={styles.rowView}>
            <MaterialCommunityIcons name="car-emergency" style={styles.rInfoIcon} />
            <PoppinsText>{item.type}</PoppinsText>
          </View>
          <View style={styles.rowView}>
            <Ionicons name='location-outline' style={styles.rInfoIcon} />
            <PoppinsText style={{ flex: 0.9 }}>{address}</PoppinsText>
          </View>
          <View style={styles.rowView}>
            <Ionicons name='calendar-outline' style={styles.rInfoIcon} />
            <PoppinsText>{dateAndTime}</PoppinsText>
          </View>
          <View style={styles.rowView}>
            <FontAwesome name="money" style={styles.rInfoIcon} />
            <PoppinsText>50 EGP</PoppinsText>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={{ ...styles.btn, backgroundColor: secondryColor }}
        onPress={handleReportBtn}
      >
        <PoppinsText style={{ color: mainColor }}>Report</PoppinsText>
      </TouchableOpacity>
      <View style={{ height: 85 }} />
    </ScrollView>
  )
}

export default SelectedHistoryScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: 'white'
  },
  mapContainer: {
    elevation: 5,
    borderRadius: 16,
    backgroundColor: 'white',
    height: 200,
    overflow: 'hidden',
    margin: 4
  },
  map: {
    borderRadius: 16,
    flex: 1
  },
  icon: {
    fontSize: 30,
    color: mainColor
  },
  rInfoIcon: {
    color: mainColor,
    fontSize: 22,
    marginRight: 6,
    alignSelf: 'flex-start'
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    height: 60,
    width: 60,
    borderRadius: 60,
    marginRight: 8
  },
  highLightedText: {
    color: mainColor
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 25,
    margin: 10,
  }
})