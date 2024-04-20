function createApplicationError(msg, errorCode, cause) {
    const error = Error(msg, cause);
    error.errorCode = errorCode;
    error.isApplicationError = true;
    return error;
}

export default createApplicationError;