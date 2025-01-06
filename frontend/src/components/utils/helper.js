function generateUniqueId() {
    const now = Date.now(); // Current time in milliseconds
    const random = Math.floor(Math.random() * 1000); // Random number between 0 and 999
    return `${now}${random}`; // Combine milliseconds and random for uniqueness
}

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export {
    generateUniqueId,
    validateEmail
}