const express = require('express');
const app = express();

const user = require('./routes/user');
const subAdmin = require('./routes/subAdmin');
const subAdminCreate = require('./routes/subAdminCreate');
const subAdminUpdate = require('./routes/subAdminUpdate');
const subAdminDelete = require('./routes/subAdminDelete');
const admin = require('./routes/admin');
const adminCreate = require('./routes/adminCreate');
const adminUpdate = require('./routes/adminUpdate');
const adminDelete = require('./routes/adminDelete');

app.use(express.json())
app.use('/user',user)
app.use('/sub-admin',subAdmin)
app.use('/sub-admin/create',subAdminCreate)
app.use('/sub-admin/update',subAdminUpdate)
app.use('/sub-admin/delete',subAdminDelete)
app.use('/admin',admin)
app.use('/admin/create',adminCreate)
app.use('/admin/update',adminUpdate)
app.use('/admin/delete',adminDelete)

app.listen(5000,()=>{
    console.log('Server is listening on port 5000...');
})

