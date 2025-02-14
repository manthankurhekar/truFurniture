const mongoose = require('mongoose');
const toJSON = require('./plugins/toJSON.plugin');

const adminSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    }, 
    orgId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Organization', 
        required: true
    }
});

adminSchema.plugin(toJSON);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;