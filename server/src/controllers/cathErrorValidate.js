export const cathError = (error) => {
    if (error.details) {
        const errorMessages = error.details.map((detail) => detail.message);
        return errorMessages[0];
    } else {
        return error;
    }
}