import mongoose, { mongo } from 'mongoose';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        trim: true,
        require:true
    },
    email: {
        type: String,
        trim: true,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require:true,
        min: 6,
        max: 64
    },
})

const User = mongoose.model('User', userSchema);

export default User;