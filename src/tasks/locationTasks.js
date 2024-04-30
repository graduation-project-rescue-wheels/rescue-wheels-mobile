import * as TaskManager from 'expo-task-manager'
import { store } from '../store/store'
import { socket } from '../api/socket.io';

export const UPDATE_LOCATION_TASK = 'UPDATE_LOCATION_TASK'

TaskManager.defineTask(UPDATE_LOCATION_TASK, ({ data: { locations }, error }) => {
    if (error) {
        return;
    }

    const requestId = store.getState().user.user.onGoingRequestId

    socket.emit('request:responder-location-changed', {
        requestId,
        coords: locations[0].coords
    })
})