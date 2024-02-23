import { emailRegex } from "./regex"

export const validatePassword = (password) => {
    if (password.length === 0) {
        return {
            isValid: false,
            message: 'Please enter your password'
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