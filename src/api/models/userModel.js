import db from '../helpers/constants/db.js';
import generate from './generic.model.js';

let userModel = generate('users', 'user_id');
userModel.findByEmail = async function (email) {
    const row = await db('users').where('email', email);
    if (row.length == 0) {
        return null;
    }
    return row[0];
}

export default userModel;