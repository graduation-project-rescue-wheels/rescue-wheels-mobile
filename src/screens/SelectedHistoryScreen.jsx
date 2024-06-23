import React, { useEffect, useState } from 'react'
import { getRequestById } from '../api/EmergencyRequest'
import MapView, { Marker } from 'react-native-maps'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import showToast from '../components/Toast'
import { useSelector } from 'react-redux'
import { mainColor, secondryColor } from '../colors'
import PoppinsText from '../components/PoppinsText'
import { MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { getAddress } from '../utils/locations'

const SelectedHistoryScreen = ({ route }) => {
  const { user } = useSelector(state => state.user)
  const { sHistory } = route.params
  const [request, setRequest] = useState()
  const [address, setAddress] = useState('')
  const [dateAndTime, setDateAndTime] = useState('')

  const fetchRequest = async () => {
    try {
      const response = await getRequestById(sHistory)

      if (response.status === 200) {
        const date = new Date(response.data.request.createdAt)
        getAddress(response.data.request.coordinates).then(address => {
          setAddress(address.data.results[0].formatted_address)
        })
        setRequest(response.data.request)
        setDateAndTime(`${date.toDateString()} ${date.toLocaleTimeString()}`)
      }
    } catch (err) {
      console.log(err);
      showToast("Couldn't get request data")
    }
  }

  const handleReportBtn = () => {
    /*todo*/
  }

  useEffect(() => {
    if (sHistory) {
      fetchRequest()
    }
  }, [])

  return (
    <View style={styles.container}>
      {request && <>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            showsUserLocation
            showsMyLocationButton={false}
            region={request && {
              ...request.coordinates,
              latitudeDelta: 0.006866,
              longitudeDelta: 0.004757
            }}
            provider='google'
            scrollEnabled={false}
          >
            <Marker
              coordinate={request.coordinates}
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
                  source={request.requestedBy.profilePic.length === 0 ?
                    require('../assets/images/avatar.png') :
                    { uri: request.requestedBy.profilePic }
                  }
                  style={styles.profilePic}
                />
                <View>
                  <PoppinsText style={{ fontSize: 18 }}>
                    {request.requestedBy.firstName} {request.requestedBy.lastName}
                  </PoppinsText>
                  <PoppinsText style={styles.highLightedText}> {request.requestedBy.rate} </PoppinsText>
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
                  source={request.responder.profilePic.length === 0 ?
                    require('../assets/images/avatar.png') :
                    { uri: request.responder.profilePic }
                  }
                  style={styles.profilePic}
                />
                <View>
                  <PoppinsText style={{ fontSize: 18 }}>
                    {request.responder.firstName} {request.responder.lastName}
                  </PoppinsText>
                  <PoppinsText style={styles.highLightedText}> {request.responder.rate} </PoppinsText>
                </View>
              </View>
            </View>
          }
          <PoppinsText style={{ color: mainColor, fontSize: 16, marginTop: 12, marginHorizontal: 8 }}>Request information</PoppinsText>
          <View style={{ marginHorizontal: 6 }}>
            <View style={styles.rowView}>
              <MaterialCommunityIcons name="car-emergency" style={styles.rInfoIcon} />
              <PoppinsText>{request.type}</PoppinsText>
            </View>
            <View style={styles.rowView}>
              <Ionicons name='location-outline' style={styles.rInfoIcon} />
              <PoppinsText style={styles.infoText}>{address}</PoppinsText>
            </View>
            <View style={styles.rowView}>
              <Ionicons name='calendar-outline' style={styles.rInfoIcon} />
              <PoppinsText style={styles.infoText}>{dateAndTime}</PoppinsText>
            </View>
            <View style={styles.rowView}>
            <FontAwesome name="money" style={styles.rInfoIcon} />
              <PoppinsText style={styles.infoText}>50 EGP</PoppinsText>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={{ ...styles.btn, backgroundColor: secondryColor }}
          onPress={handleReportBtn}
        >
          <PoppinsText style={{ color: mainColor }}>Report</PoppinsText>
        </TouchableOpacity>
      </>
      }
    </View>
  )
}

export default SelectedHistoryScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8
  },
  mapContainer: {
    elevation: 5,
    borderRadius: 16,
    backgroundColor: 'white',
    height: "35%",
    overflow: 'hidden'
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
  },
})