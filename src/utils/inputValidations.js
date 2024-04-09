import { emailRegex, passwordRegex, phoneNumberRegex } from "./regex"

export const validatePassword = (password) => {
    if (password.length === 0) {
        return {
            isValid: false,
            message: 'Please enter your password'
        }
    } else if (!passwordRegex.test(password)) {
        return {
            isValid: false,
            message: 'Password must be: \n * Minimum length of 8 characters \n * At least one lowercase and one uppercase letter.\n * At least one digit.\n * At least one special character (!@#$%^&*).'
        }
    } else {
        return {
            isValid: true,
            message: ''
        }
    }
}

export const validateEmail = (email) => {
    if (email.length === 0) {
        return {
            isValid: false,
            message: 'Please enter an e-mail'
        }
    } else if (!emailRegex.test(email)) {
        return {
            isValid: false,
            message: 'Invalid E-mail address'
        }
    } else {
        return {
            isValid: true,
            message: ''
        }
    }
}

export const validatePhoneNumber = (phoneNumber) => {
    if (phoneNumber.length === 0) {
        return {
            isValid: false,
            message: 'Please enter your Phone number'
        }
    } else if (!phoneNumberRegex.test(phoneNumber)) {
        return {
            isValid: false,
            message: 'Enter valid Phone number'
        }
    } else {
        return {
            isValid: true,
            message: ''
        }
    }
}

export const validateFirstName = (firstName) => {
    if (firstName.length === 0) {
        return {
            isValid: false,
            message: 'Please enter your first name'
        }
    } else {
        return {
            isValid: true,
            message: ''
        }
    }
}

export const validateLastName = (lastName) => {
    if (lastName.length === 0) {
        return {
            isValid: false,
            message: 'Please enter your last name'
        }
    } else {
        return {
            isValid: true,
            message: ''
        }
    }
}

export const validateConfirmationPassword = (passowrd, confirmPassword) => {
    if (confirmPassword.length === 0) {
        return {
            isValid: false,
            message: 'Please confirm your password'
        }
    } else if (passowrd != confirmPassword) {
        return {
            isValid: false,
            message: 'Password does not match'
        }
    } else {
        return {
            isValid: true,
            message: ''
        }
    }
}

export const validateOldPassword = (oldPassword) => {
    if (oldPassword.length === 0) {
        return {
            isValid: false,
            message: 'Please enter your old password'
        }
    } else {
        return {
            isValid: true,
            message: ''
        }
    }
}

export const validateVehicleMaker = (make) => {
    if (make.length === 0) {
        return {
            isValid: false,
            message: 'Please enter vehicle maker'
        }
    } else {
        return {
            isValid: true,
            message: ''
        }
    }
}

export const validateVehicleModel = (model) => {
    if (model.length === 0) {
        return {
            isValid: false,
            message: 'Please enter vehicle model'
        }
    } else {
        return {
            isValid: true,
            message: ''
        }
    }
}

export const validateLicensePlate = (licensePlate) => {
    if (licensePlate.length === 0) {
        return {
            isValid: false,
            message: 'Please enter license plate'
        }
    } else {
        return {
            isValid: true,
            message: ''
        }
    }
}

export const validateModelYear = (modelYear) => {
    if (modelYear.length === 0) {
        return {
            isValid: false,
            message: 'Please enter model year'
        }
    } else if (modelYear.length > 4) {
        return {
            isValid: false,
            message: 'Please enter a valid year'
        }
    } else {
        return {
            isValid: true,
            message: ''
        }
    }
}

export const validateVehicleType = (type) => {
    if (type.length === 0) {
        return {
            isValid: false,
            message: 'Please enter vehicle type'
        }
    } else {
        return {
            isValid: true,
            message: ''
        }
    }
}

export const validateVehicleEnergySource = (energySource) => {
    if (energySource.length === 0) {
        return {
            isValid: false,
            message: "Please enter vehicle's energy source"
        }
    } else {
        return {
            isValid: true,
            message: ''
        }
    }
}

export const validateSelectedVehicle = (vehicle) => {
    return vehicle ? {
        isValid: true,
        message: ''
    } : {
        isValid: false,
        message: 'Please choose a vehicle'
    }
}

export const validateSelectedEmergency = (emergency) => {
    return emergency ? {
        isValid: true,
        message: ''
    } : {
        isValid: false,
        message: 'Please choose an emergency'
    }
}

export const validateAddress = (address) => {
    return address.length > 0 ? {
        isValid: true,
        message: ''
    } : {
        isValid: false,
        message: 'Please enter an address or choose drop off on the map'
    }
}