function generateUniqueId() {
    const now = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${now}${random}`;
}

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const statusDisplay = (status) => {
    switch(status){
        case "true":
            return "active-badge";
        case "pending":
            return "pending-badge";
        case "decline":
            return "decline-badge";
        case "blocked":
            return "blocked-badge";
        default:
            return "pending-badge";
    }
}

const capitalizeFirstLetter = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
}

export {
    generateUniqueId,
    validateEmail,
    statusDisplay,
    capitalizeFirstLetter
}