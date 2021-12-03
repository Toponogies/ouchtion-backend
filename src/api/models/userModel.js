import db from '../helpers/constants/db.js';
import generate from './generic.model.js';

let userModel = generate('users', 'id');
userModel.findByEmail = async function (email) {
    const row = await db('users').where('username', email);
    if (row.length == 0) {
        return null;
    }
    return row[0];
}

export default userModel;