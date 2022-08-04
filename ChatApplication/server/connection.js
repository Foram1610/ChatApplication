const mongoose = require('mongoose');
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(()=>console.log('MongoDB connected!!'))
    .catch(()=>console.log('Somthing went wrong!!'))

module.exports = mongoose;