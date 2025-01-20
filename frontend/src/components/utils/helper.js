function generateUniqueId() {
    const now = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${now}${random}`;
}

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export {
    generateUniqueId,
    validateEmail
}