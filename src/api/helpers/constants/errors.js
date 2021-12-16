export const UNEXPECTED_ERROR = {
    title: 'Internal server error.',
    detail: 'Something is wrong.'
};

export const REDIS_SERVER_ERROR = {
    title: 'Redis server error.',
    detail: 'Server redis is wrong.'
};

export const NOTFOUND_REDIS = {
    title: 'Not found redis.',
    detail: 'Redis data is not available.'
};

export const NOTFOUND_ERROR = {
    title: 'Not found.',
    detail: 'Endpoint is not available.'
};

export const LOGIN_ERROR = {
    title: 'UNAUTHORIZED.',
    detail: 'Enter a invaild email or password .'
};

export const DB_QUERY_ERROR = {
    title: 'CONFLICT.',
    detail: 'Conflict database query'
};

export const INVAILD_ACCESSTOKEN = {
    title: "Invalid access token.",
    detail: "Invalid access token."
};

export const NOTFOUND_ACCESSTOKEN = {
    title: "Not found access token.",
    detail: "Not found access token."
};

export const INVAILD_REFRESHTOKEN = {
    title: "Invalid refresh token.",
    detail: "Invalid refresh token."
};

export const EXPIRED_ACCESSTOKEN = {
    title: "Exprired access token",
    detail: "Access token is expried"
};

export const EXPIRED_REFRESHTOKEN = {
    title: "Exprired refresh token",
    detail: "Refresh token is expried"
};

export const INVAILD_VERIFYTOKEN = {
    title: "Invalid verify token.",
    detail: "Invalid verify token."
};

export const EXPIRED_VERIFYTOKEN = {
    title: "Exprired verify token",
    detail: "Verify token is expried"
};

export const ACCOUNT_NOT_ACTIVE = {
    title: "Account not active",
    detail: "Account not active"
};

export const NOT_PERMISSION = {
    title: "Not permission access endpoint",
    detail: "Not permission access endpoint"
};

export function VALIDATION_ERROR(validate_err){
    return {
        title: "VALIDATION_ERROR",
        detail: "Can't validation this request",
        field: validate_err
    };
}

export const NOT_FOUND_PRODUCT = {
    title: "Not found product",
    detail: "Not found product"
};

export const NOT_FOUND_IMAGE = {
    title: "Not found image",
    detail: "Not found image"
};


export const NOT_FOUND_FILE = {
    title: "Not found file",
    detail: "Not found file"
}