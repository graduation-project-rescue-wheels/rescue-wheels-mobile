import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import PoppinsText from '../components/PoppinsText'
import { useMemo, useState } from 'react'
import UserServicesFlatListItem from '../components/UserServicesFlatListItem'
import NoHistory from '../components/NoHistory'
import { MaterialIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import CustomModal from '../components/CustomModal'
import EmergencyFlatListItem from '../components/EmergencyFlatListItem'
import VehicleFlatListItem from '../components/VehicleFlatListItem'
import NoVehicles from '../components/NoVehicles'
import NoOffers from '../components/NoOffers'

const UserHomeScreen = () => {
    const { user } = useSelector(state => state.user)
    const [emergencyModalVisible, setEmergencyModalVisible] = useState(false)
    const [emergencySelectionModalVisible, setEmergencySelectionModalVisible] = useState(false)
    const [vehicleSelectionModalVisible, setVehicleSelectionModalVisible] = useState(false)
    const [selectedEmergency, setSelectedEmergency] = useState(null)
    const [selectedVehicle, setSelectedVehicle] = useState(null)
    const isFirstHalfOfDay = useMemo(() => new Date().getHours() < 12, [])
    const username = useMemo(() => `${user.firstName} ${user.lastName}`, [])
    const services = [
        {
            imageSrc: require('../assets/images/siren.png'),
            label: 'Emergency',
            onPress: () => {
                setEmergencyModalVisible(true)
            }
        },
        {
            imageSrc: require('../assets/images/service-station.png'),
            label: 'Repair centers',
            onPress: () => {
                //TODO
            }
        }
    ]

    const emergencies = [
        {
            label: 'Flat tire',
            Icon: () => <MaterialIcons name='tire-repair' style={styles.selectedEmergencyIcon} />,
            onPress: () => {
                setSelectedEmergency({
                    label: 'Flat tire',
                    Icon: () => <MaterialIcons name='tire-repair' style={styles.selectedEmergencyIcon} />
                })
                setEmergencySelectionModalVisible(false)
            }
        },
        {
            label: 'Out of fuel/Dead battery',
            Icon: () => <MaterialCommunityIcons name='fuel-cell' style={styles.selectedEmergencyIcon} />,
            onPress: () => {
                setSelectedEmergency({
                    label: 'Out of fuel/Dead battery',
                    Icon: () => <MaterialCommunityIcons name='fuel-cell' style={styles.selectedEmergencyIcon} />,
                })
                setEmergencySelectionModalVisible(false)
            }
        },
        {
            label: 'Other',
            Icon: () => <MaterialCommunityIcons name='tow-truck' style={styles.selectedEmergencyIcon} />,
            onPress: () => {
                setSelectedEmergency({
                    label: 'Other',
                    Icon: () => <MaterialCommunityIcons name='tow-truck' style={styles.selectedEmergencyIcon} />,
                })
                setEmergencySelectionModalVisible(false)
            }
        }
    ]

    return (
        <View style={styles.container}>
            {/*request emergency modal*/}
            <CustomModal
                onRequestClose={() => setEmergencyModalVisible(false)}
                visible={emergencyModalVisible}
            >
                <PoppinsText style={styles.modalTitle}>Request emergency</PoppinsText>
                {
                    selectedEmergency === null ?
                        <EmergencyFlatListItem
                            Icon={() => <AntDesign name='select1' style={styles.selectedEmergencyIcon} />}
                            label={'Select emergency'}
                            onPress={() => setEmergencySelectionModalVisible(true)}
                        /> : <EmergencyFlatListItem
                            Icon={selectedEmergency.Icon}
                            label={selectedEmergency.label}
                            onPress={() => setEmergencySelectionModalVisible(true)}
                        />
                }
                {
                    selectedVehicle === null ?
                        <VehicleFlatListItem
                            Icon={() => <AntDesign name='select1' style={styles.selectedEmergencyIcon} />}
                            label={'Select your vehicle'}
                            onPress={() => setVehicleSelectionModalVisible(true)}
                        /> : <VehicleFlatListItem
                            Icon={selectedVehicle.Icon}
                            label={selectedVehicle.label}
                            onPress={() => setVehicleSelectionModalVisible(true)}
                        />
                }
                <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 8
                }}>
                    <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={() => {
                            setEmergencyModalVisible(false)
                            setSelectedEmergency(null)
                            setSelectedVehicle(null)
                        }}
                    >
                        <PoppinsText style={{ color: '#ADADAD' }}>cancel</PoppinsText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.modalBtn}
                        onPress={() => {/*TODO*/ }}
                    >
                        <PoppinsText style={{ color: '#E48700' }}>request</PoppinsText>
                    </TouchableOpacity>
                </View>
            </CustomModal>
            {/*choose emergency type modal*/}
            <CustomModal
                visible={emergencySelectionModalVisible}
                onRequestClose={() => {
                    setEmergencySelectionModalVisible(false)
                    setSelectedEmergency(null)
                }}
            >
                <PoppinsText style={styles.modalTitle}>Choose emergency:</PoppinsText>
                <View style={styles.flatListModalView}>
                    <FlatList
                        data={emergencies}
                        renderItem={({ item }) => <EmergencyFlatListItem
                            label={item.label}
                            Icon={item.Icon}
                            onPress={item.onPress}
                        />}
                    />
                </View>
                <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={() => {
                        setEmergencySelectionModalVisible(false)
                        setSelectedEmergency(null)
                    }}
                >
                    <PoppinsText style={{ color: '#ADADAD' }}>cancel</PoppinsText>
                </TouchableOpacity>
            </CustomModal>
            {/*choose vehicle modal*/}
            <CustomModal
                visible={vehicleSelectionModalVisible}
                onRequestClose={() => {
                    setVehicleSelectionModalVisible(false)
                    setSelectedVehicle(null)
                }}
            >
                <PoppinsText style={styles.modalTitle}>Choose your vehicle</PoppinsText>
                <View style={styles.flatListModalView}>
                    <FlatList
                        data={user.vehicles}
                        renderItem={({ item }) => <VehicleFlatListItem
                            Icon={null}
                            label={item.model}
                            onPress={() => selectedVehicle(item)}
                        />}
                        ListEmptyComponent={<NoVehicles onPress={() => {/*todo*/ }} />}
                    />
                </View>
                <TouchableOpacity
                    style={styles.modalBtn}
                    onPress={() => {
                        setVehicleSelectionModalVisible(false)
                        setSelectedVehicle(null)
                    }}
                >
                    <PoppinsText style={{ color: '#ADADAD' }}>cancel</PoppinsText>
                </TouchableOpacity>
            </CustomModal>
            <ScrollView style={{ flex: 1 }}>
                {
                    isFirstHalfOfDay ?
                        <PoppinsText style={styles.greetingText}>Good morning, <PoppinsText style={{ color: 'black' }}>
                            {username}
                        </PoppinsText>
                        </PoppinsText>
                        : <PoppinsText style={styles.greetingText}>Good afternoon, <PoppinsText style={{ color: 'black' }}>
                            {username}
                        </PoppinsText>
                        </PoppinsText>
                }
                <PoppinsText style={styles.helpText}>
                    How can we help you?
                </PoppinsText>
                <FlatList
                    style={{ marginBottom: 16 }}
                    data={services}
                    renderItem={({ item }) => <UserServicesFlatListItem
                        imageSrc={item.imageSrc}
                        label={item.label}
                        onPress={item.onPress}
                    />}
                    keyExtractor={(_, index) => index}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
                <PoppinsText style={styles.sectionTitle}>Offers</PoppinsText>
                <View style={styles.cardView}>
                    <FlatList
                        style={{ marginBottom: 32 }}
                        data={user.history}
                        keyExtractor={(item) => item._id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        ListEmptyComponent={<NoOffers />}
                        contentContainerStyle={{ alignItems: user.history ? 'flex-start' : 'center', flex: 1 }}
                    />
                </View>
                <PoppinsText style={styles.sectionTitle}>History</PoppinsText>
                <View style={styles.cardView}>
                    <View style={styles.historySectionTitleView}>
                        <PoppinsText>Previous emergencies</PoppinsText>
                        <TouchableOpacity>
                            <PoppinsText style={styles.seeAllText}>see all</PoppinsText>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        style={{ marginBottom: 32 }}
                        data={user.history}
                        keyExtractor={(item) => item._id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        ListEmptyComponent={<NoHistory message="You don't have any previous emergencies" />}
                        contentContainerStyle={{ alignItems: user.history ? 'flex-start' : 'center', flex: 1 }}
                    />
                </View>
                <View style={styles.cardView}>
                    <View style={styles.historySectionTitleView}>
                        <PoppinsText>Previous repair center visits</PoppinsText>
                        <TouchableOpacity>
                            <PoppinsText style={styles.seeAllText}>see all</PoppinsText>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        style={{ marginBottom: 32 }}
                        data={user.history}
                        keyExtractor={(item) => item._id}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        ListEmptyComponent={<NoHistory message="You didn't visit any of our repair centers" />}
                        contentContainerStyle={{ alignItems: user.history ? 'flex-start' : 'center', flex: 1 }}
                    />
                </View>
                <View style={{ height: 80 }} />
            </ScrollView>
            <TouchableOpacity style={styles.supportBtn}>
                <MaterialIcons
                    name='support-agent'
                    style={styles.supportBtnIcon}
                />
            </TouchableOpacity>
        </View>
    )
}

export default UserHomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 8,
        paddingHorizontal: 8,
        backgroundColor: 'white'
    },
    greetingText: {
        fontSize: 20,
        color: '#E48700'
    },
    historySectionTitleView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    helpText: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 8
    },
    seeAllText: {
        color: '#666666'
    },
    cardView: {
        backgroundColor: '#F6EEE3',
        borderRadius: 16,
        padding: 8,
        elevation: 5,
        marginBottom: 16,
        marginHorizontal: 8
    },
    supportBtn: {
        position: 'absolute',
        backgroundColor: '#E48700',
        padding: 8,
        borderRadius: 50,
        bottom: 85,
        right: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5
    },
    supportBtnIcon: {
        fontSize: 40,
        color: 'white'
    },
    selectedEmergencyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        alignSelf: 'baseline',
        width: '100%'
    },
    selectedEmergencyLabel: {
        fontSize: 20
    },
    selectedEmergencyIcon: {
        fontSize: 20,
        marginRight: 8
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 8
    },
    modalBtn: {
        padding: 8
    },
    flatListModalView: {
        height: 120,
        marginBottom: 8
    },
    sectionTitle: {
        fontSize: 24
    }
})