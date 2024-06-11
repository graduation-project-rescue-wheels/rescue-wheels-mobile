import React, { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Image, Linking, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import { MaterialIcons } from '@expo/vector-icons'
import PoppinsText from '../components/PoppinsText'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { getRequestById } from '../api/EmergencyRequest'
import { useIsFocused } from '@react-navigation/native'
import { mainColor, secondryColor } from '../colors'
import HistoryFlatListItem from '../components/HistoryFlatListItem'
import HistoryFlatListEmptyComponent from '../components/HistoryFlatListEmptyComponent'

const TechnicianHomeScreen = ({ navigation }) => {

    const { user } = useSelector(state => state.user)
    const techUsername = useMemo(() => `${user.firstName} ${user.lastName}`, [user.firstName, user.lastName])
    const isFirstHalfOfDay = useMemo(() => new Date().getHours() < 12, [])
    const [onGoingRequests, setonGoingRequests] = useState(null)
    const isFocused = useIsFocused()
    const [recentHistory, setRecentHistory] = useState(null)

    const getOnGoingRequests = async () => {
        if (user.onGoingRequestId) {
            const requestData = await getRequestById(user.onGoingRequestId)
            setonGoingRequests(requestData.data.request)
        } else setonGoingRequests(null)
    }

    const handleCallBtn = () => {
        if (Platform.OS === 'android')
            Linking.openURL(`tel:${onGoingRequests?.requestedBy.mobileNumber}`)
        else if (Platform.OS === 'ios')
            Linking.openURL(`telprompt:${onGoingRequests?.requestedBy.mobileNumber}`)
    }



    useEffect(() => {
        setRecentHistory([...user.Requests_IDS].reverse().map(e => {
            return e
        }))
    }, [])
    
    useEffect(() => {
        if (isFocused) {
            getOnGoingRequests()
        }
    }, [isFocused])

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
                        <Image
                            source={user.profilePic.length === 0 ? require('../assets/images/avatar.png') : { uri: user.profilePic }}
                            style={styles.profilePic}
                        />
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
                                <PoppinsText style={styles.greyText}> {user.status} </PoppinsText>
                            </View>
                        </View>
                    </View>
                    <View style={styles.line}></View>
                    <View style={styles.businessInfo}>
                        <View style={{ justifyContent: 'center' }}>
                            <PoppinsText style={styles.greyText}>Your rate</PoppinsText>
                            <View style={{ flexDirection: 'row' }}>
                                <MaterialIcons name="star" size={25} color={mainColor} />
                                <PoppinsText style={styles.highLightedText}> {user.rate} </PoppinsText>
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                            <PoppinsText style={styles.greyText}>Total requests </PoppinsText>
                            <PoppinsText style={styles.highLightedText}> {user.Requests_IDS.length} </PoppinsText>
                        </View>
                    </View>
                </View>
                <PoppinsText style={{ fontSize: 20 }}>Current activities</PoppinsText>
                <View style={styles.CardView}>
                    <PoppinsText style={styles.cardViewTitle}>Ongoing request</PoppinsText>
                    {
                        onGoingRequests === null ?
                            <View style={{ alignItems: 'center' }}>
                                <PoppinsText style={{ ...styles.greyText, padding: 30 }}>
                                    You don't have any ongoing request
                                </PoppinsText>
                            </View> :
                            <View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        source={onGoingRequests.requestedBy.profilePic.length === 0 ? require('../assets/images/avatar.png') : { uri: onGoingRequests.requestedBy.profilePic }}
                                        style={styles.profilePic}
                                    />
                                    <View style={{ justifyContent: 'center' }}>
                                        <PoppinsText style={{ fontSize: 18 }}>
                                            {onGoingRequests?.requestedBy.firstName} {onGoingRequests?.requestedBy.lastName}
                                        </PoppinsText>
                                        <PoppinsText style={styles.greyText}>
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
                                            <MaterialIcons name="call" size={26} color={mainColor} />
                                            <PoppinsText style={{ ...styles.greyText, marginLeft: 5 }}>
                                                Call
                                            </PoppinsText>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <TouchableOpacity
                                            style={styles.Buttons}
                                            onPress={() => { navigation.navigate("Emergency-stack") }}>
                                            <MaterialIcons name="info" size={26} color={mainColor} />
                                            <PoppinsText style={{ ...styles.greyText, marginLeft: 5 }}>
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
                        <TouchableOpacity onPress={() => {navigation.navigate("History")}}>
                            <PoppinsText style={{ color: '#666666' }}>see all</PoppinsText>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={recentHistory?.slice(0,5)}
                        renderItem={({ item }) => <HistoryFlatListItem item={item} navigation={navigation} />}
                        keyExtractor={(item, _) => item}
                        ListFooterComponent={<View style={{ height: 80 }} />}
                        ListEmptyComponent={<HistoryFlatListEmptyComponent />}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
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
        color: mainColor
    },
    CardView: {
        padding: 10,
        backgroundColor: secondryColor,
        marginHorizontal: 2,
        marginBottom: 30,
        borderRadius: 16,
        elevation: 5
    },
    profilePic: {
        height: 60,
        width: 60,
        borderRadius: 60,
        backgroundColor: 'white',
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
        color: mainColor
    },
    cardTitleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    greyText: {
        fontSize: 16,
        color: '#666666'
    },
    highLightedText: {
        fontSize: 20,
        color: mainColor
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