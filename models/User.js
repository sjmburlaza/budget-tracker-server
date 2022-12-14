const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required.']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required.']
    },
    email: {
        type: String,
        required: [true, 'Email is required.']
    },
    password: {
        type: String,
        // required: [true, 'Password is required']
    },
    loginType: {
        type: String,
        required: [true, 'Login type is required.']
    },
    categories: [
        {
            name: {
                type: String,
                required: [true, 'Category name is required.']
            },
            type: {
                type: String,
                required: [true, 'Category type is required.']
            },
            createdOn: {
                type: Date,
                default: Date.now(),
                required: 'Please enter the date this transaction took place.'
            },
        }
    ],
    records: [
        {
            categoryName: {
                type: String,
                required: [true, 'Category name is required.']
            },
            categoryType: {
                type: String,
                required: [true, 'Category type is required.']
            },
            categoryId: {
                type: String,
                required: [true, 'Category ID is required.']
            },
            description: {
                type: String,
                required: [true, 'Description is required.']
            },
            createdOn: {
                type: Date,
                default: Date.now(),
                required: 'Please enter the date this transaction took place.'
            },
            amount: {
                type: Number,
                required: [true, 'Amount is required.']
            },
            isDeleted: {
                type: Boolean,
                default: false,
                required: [true, 'Is this deleted?']
            }
        }
    ]
    
})

module.exports = mongoose.model('User', UserSchema);