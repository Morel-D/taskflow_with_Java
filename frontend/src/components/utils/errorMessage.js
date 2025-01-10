export const errorMessages = {

    /// Default Server Errors---------------------

    400: "Bad Request: The data you provided is invalid.",
    401: "Unauthorized: Please log in to continue.",
    403: "Forbidden: You don't have permission to access this resource.",
    404: "Not Found: The requested resource could not be found.",
    500: "Internal Server Error: Something went wrong on our end.",
    NETWORK_ERROR: "Network Error: Please check your internet connection.",
    UNKNOWN_ERROR: "An unknown error occurred. Please try again later.",

    /// Server Error -------------------------

    "path-incomplete": "Invalid request path.",
    "email-already-registered": "Email is already exist.",
    "empty-email": "Email cannot be empty.",
    "empty-username": "Username cannot be empty.",
    "empty-password": "Password cannot be empty.",
    "user-not-created": "Failed to create user.",
    "invalid-credentials": "Incorrect email or password.",
    "failed-to-get": "Unable to retrieve data."

}