import React, { useEffect, useMemo, useState } from 'react'
import { Linking, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import { MaterialIcons } from '@expo/vector-icons'
import PoppinsText from '../components/PoppinsText'
import { Ionicons } from "@expo/vector-icons"
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import NoHistory from '../components/NoHistory'
import { getRequestById } from '../api/EmergencyRequest'
import { Fontisto } from '@expo/vector-icons';

const TechnicianHomeScreen = ({ navigation }) => {

    const { user } = useSelector(state => state.user)
    const techUsername = useMemo(() => `${user.firstName} ${user.lastName}`, [user.firstName, user.lastName])
    const isFirstHalfOfDay = useMemo(() => new Date().getHours() < 12, [])
    const [technicianRate, setTechnicianRate] = useState(0.0)
    const [totalRequests, setTotalRequests] = useState(0)
    const [onGoingRequests, setonGoingRequests] = useState(null)

    const getOnGoingRequests = async () => {

        if (user.onGoingRequestId != null) {
            const requestData = await getRequestById(user.onGoingRequestId)
            setonGoingRequests(requestData.data.request)
        }
    }

    const handleCallBtn = () => {
        if (Platform.OS === 'android')
            Linking.openURL(`tel:${onGoingRequests?.requestedBy.mobileNumber}`)
        else if (Platform.OS === 'ios')
            Linking.openURL(`telprompt:${onGoingRequests?.requestedBy.mobileNumber}`)
    }

    useEffect(() => {
        getOnGoingRequests()
    }, [])

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1 }}>
                {
                    isFirstHalfOfDay ?
                        <PoppinsText style={styles.greetingText}>Good morning</PoppinsText>
                        : <PoppinsText style={styles.greetingText}>Good afternoon</PoppinsText>
                }
                <View style={{ ...styles.CardView, marginTop: 20 }}>
                    <View style={{ flexDirection: 'row' }}>
                        {
                            user.profilePic.length === 0 ?
                                <Ionicons
                                    name='person-circle-outline'
                                    style={styles.profilePic}
                                /> : <Image
                                    source={{ uri: user.profilePic }}
                                    style={styles.profilePic}
                                />
                        }
                        <View style={{ justifyContent: 'center' }}>
                            <PoppinsText style={{ fontSize: 18 }}>
                                {techUsername}
                            </PoppinsText>
                            <View style={styles.onlineView}>
                                <MaterialIcons
                                    name="online-prediction"
                                    size={24}
                                    color={
                                        user.status == "online" ? 'green' : 'red'
                                    } />
                                <PoppinsText style={styles.highLightedText}> {user.status} </PoppinsText>
                            </View>
                        </View>
                    </View>
                    <View style={styles.line}></View>
                    <View style={styles.businessInfo}>
                        <View style={{ justifyContent: 'center' }}>
                            <PoppinsText style={styles.highLightedText}>Your rate</PoppinsText>
                            <View style={{ flexDirection: 'row' }}>
                                <MaterialIcons name="star" size={25} color='#E48700' />
                                <PoppinsText style={styles.orangeHighLightedText}> {technicianRate} </PoppinsText>
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                            <PoppinsText style={styles.highLightedText}>Total requests </PoppinsText>
                            <PoppinsText style={styles.orangeHighLightedText}> {totalRequests} </PoppinsText>
                        </View>
                    </View>
                </View>
                <PoppinsText style={{ fontSize: 20 }}>Current activities</PoppinsText>
                <View style={styles.CardView}>
                    <PoppinsText style={styles.cardViewTitle}>Ongoing request</PoppinsText>
                    {
                        onGoingRequests === null ?
                            <View style={{ alignItems: 'center' }}>
                                <PoppinsText style={{ ...styles.highLightedText, padding: 30 }}>
                                    You don't have any ongoing request
                                </PoppinsText>
                            </View> :
                            <View>
                                <View style={{ flexDirection: 'row' }}>
                                    {
                                        onGoingRequests.requestedBy.profilePic.length === 0 ?
                                            <Ionicons
                                                name='person-circle-outline'
                                                style={styles.profilePic}
                                            /> : <Image
                                                source={{ uri: onGoingRequests.requestedBy.profilePic }}
                                                style={styles.profilePic}
                                            />
                                    }
                                    <View style={{ justifyContent: 'center' }}>
                                        <PoppinsText style={{ fontSize: 18 }}>
                                            {onGoingRequests?.requestedBy.firstName} {onGoingRequests?.requestedBy.lastName}
                                        </PoppinsText>
                                        <PoppinsText style={styles.highLightedText}>
                                            {onGoingRequests.requestedBy.mobileNumber}
                                        </PoppinsText>
                                    </View>
                                </View>
                                <View style={styles.line}></View>
                                <View style={styles.buttonsView}>
                                    <View>
                                        <TouchableOpacity
                                            style={styles.Buttons}
                                            onPress={handleCallBtn}>
                                            <MaterialIcons name="call" size={26} color='#E48700' />
                                            <PoppinsText style={{ ...styles.highLightedText, marginLeft: 5 }}>
                                                Call
                                            </PoppinsText>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <TouchableOpacity
                                            style={styles.Buttons}
                                            onPress={() => { navigation.navigate("Emergency-stack") }}>
                                            <MaterialIcons name="info" size={26} color='#E48700' />
                                            <PoppinsText style={{ ...styles.highLightedText, marginLeft: 5 }}>
                                                Details
                                            </PoppinsText>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                    }
                </View>
                <PoppinsText style={{ fontSize: 20 }}>History</PoppinsText>
                <View style={styles.CardView}>
                    <View style={styles.cardTitleView}>
                        <PoppinsText style={styles.cardViewTitle}>Completed requests</PoppinsText>
                        <TouchableOpacity>
                            <PoppinsText style={{ color: '#666666' }}>see all</PoppinsText>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        style={{ marginBottom: 32 }}
                        data={[]}
                        keyExtractor={(item) => item._id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        ListEmptyComponent={<NoHistory message="You don't have any completed requests yet" />}
                        contentContainerStyle={{ alignItems: 'center', flex: 1 }}
                    />
                </View>
            </ScrollView>
        </View>
    )
}

export default TechnicianHomeScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 8,
        paddingBottom: 60,
        paddingHorizontal: 8,
        backgroundColor: 'white'
    },
    greetingText: {
        fontSize: 20,
        color: '#E48700'
    },
    CardView: {
        padding: 10,
        backgroundColor: '#f2ede6',
        marginHorizontal: 2,
        marginBottom: 30,
        borderRadius: 16,
        elevation: 5
    },
    profilePic: {
        fontSize: 60,
        marginRight: 8
    },
    onlineView: {
        flexDirection: 'row',
    },
    businessInfo: {
        marginHorizontal: 10,
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    line: {
        marginTop: 15,
        marginHorizontal: 15,
        flex: 1,
        height: 1,
        backgroundColor: 'gray',
        opacity: 0.3
    },
    verticalLine: {
        width: 1,
        backgroundColor: 'gray',
        opacity: 0.3
    },
    cardViewTitle: {
        fontSize: 16,
        color: "#E48700"
    },
    cardTitleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    highLightedText: {
        fontSize: 16,
        color: '#666666'
    },
    orangeHighLightedText: {
        fontSize: 20,
        color: "#E48700"
    },
    Buttons: {
        flexDirection: "row",
    },
    buttonsView: {
        marginHorizontal: 10,
        marginTop: 15,
        justifyContent: 'space-around',
        flexDirection: 'row'
    }
})