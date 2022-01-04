
export const UNEXPECTED_ERROR = {
    title: 'INTERNAL_SERVER_ERROR',
    detail: 'Something is wrong.'
};

export const REDIS_SERVER_ERROR = {
    title: 'REDIS_SERVER_ERROR',
    detail: 'Server redis is wrong.'
};

export const NOTFOUND_REDIS = {
    title: 'NOT_FOUND_IN_REDIS',
    detail: 'Redis data is not available.'
};

export const NOTFOUND_ERROR = {
    title: 'NOT_FOUND_ENDPOINT',
    detail: 'Endpoint is not available.'
};

export const LOGIN_ERROR = {
    title: 'UNAUTHORIZED',
    detail: 'Enter a invalid email or password .'
};

export const WRONG_PASSWORD = {
    title: 'WRONG_PASSWORD',
    detail: 'Password invalid.'
};

export const DB_QUERY_ERROR = {
    title: 'CONFLICT',
    detail: 'Conflict database query'
};

export const INVAILD_ACCESSTOKEN = {
    title: 'INVAILD_ACCESSTOKEN',
    detail: 'Invalid access token.'
};

export const NOTFOUND_ACCESSTOKEN = {
    title: 'NOTFOUND_ACCESSTOKEN',
    detail: 'Not found access token.'
};

export const INVAILD_REFRESHTOKEN = {
    title: 'INVAILD_REFRESHTOKEN.',
    detail: 'Invalid refresh token.'
};

export const EXPIRED_ACCESSTOKEN = {
    title: 'EXPIRED_ACCESSTOKEN',
    detail: 'Access token is expried'
};

export const EXPIRED_REFRESHTOKEN = {
    title: 'EXPIRED_REFRESHTOKEN',
    detail: 'Refresh token is expried'
};

export const INVAILD_VERIFYTOKEN = {
    title: 'INVAILD_VERIFYTOKEN',
    detail: 'Invalid verify token.'
};

export const EXPIRED_VERIFYTOKEN = {
    title: 'EXPIRED_VERIFYTOKEN',
    detail: 'Verify token is expried'
};

export const ACCOUNT_NOT_ACTIVE = {
    title: 'ACCOUNT_NOT_ACTIVE',
    detail: 'Account not active'
};

export const NOT_PERMISSION = {
    title: 'NOT_PERMISSION',
    detail: 'Not permission access endpoint'
};

export function VALIDATION_ERROR(validate_err){
    return {
        title: 'VALIDATION_ERROR',
        detail: 'Can\'t validation this request',
        field: validate_err
    };
}

export const NOT_FOUND_PRODUCT = {
    title: 'NOT_FOUND_PRODUCT',
    detail: 'Not found product'
};

export const NOT_FOUND_WATCH = {
    title: 'NOT_FOUND_WATCH',
    detail: 'Not found watch'
};

export const NOT_FOUND_IMAGE = {
    title: 'NOT_FOUND_IMAGE',
    detail: 'Not found image'
};

export const NOT_FOUND_FILE = {
    title: 'NOT_FOUND_FILE',
    detail: 'Not found file'
};

export const NOT_FOUND_BIDDING = {
    title: 'NOT_FOUND_BIDDING',
    detail: 'Not found bidding'
};

export const NOT_FOUND_CATEGORY = {
    title: 'NOT_FOUND_CATEGORY',
    detail: 'Not found a category'
};


export const NOT_FOUND_USER = {
    title: 'NOT_FOUND_USER',
    detail: 'Not found a user'
};

export const IS_EXIST = {
    title: 'IS_EXIST',
    detail: 'This is exist'
};

export const BAD_BIDDING = {
    title: 'BAD_BIDDING',
    detail: 'You don\'t have permission bidding or bad bidding request'
};
export const SEND_REQUEST_EXIST = {
    title: 'IS_EXIST',
    detail: 'Only send one request per week'
};

export const BAD_DELETE = {
    title: 'BAD_DELETE',
    detail: 'You don\'t remove when it have foreign key in database'
};

export const BAD_REQUEST = {
    title: 'BAD_REQUEST',
    detail: 'Some key not same with foreign key'
};

export const PRODUCT_NOT_END = {
    title: 'PRODUCT_NOT_END',
    detail: 'Product bidding not finish'
};
