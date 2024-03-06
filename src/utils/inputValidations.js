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