const express = require('express')
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const json = require('csvtojson')
const MongoClient = require('mongodb').MongoClient

const url = "mongodb://localhost:27017/PerformanceMonitor"
const db = mongoose.connect(url, { useNewUrlParser: true }).then(() => {
        console.log("Database Connected")
    })
const app = express()


const PerformanceSchema = mongoose.Schema({
        id:{type: Number},
        date:{type:Date},
        P90:{type: Number},
        P80:{type: Number},
        AVG:{type:Number},
        MAX:{type:Number},
        CounterName:{type: String},
        Total:{type: Number},
        resource_name:{type: String}
})

const PerformanceModel = mongoose.model('Performance', PerformanceSchema)


app.get('/csvtojson',(req,res)=>{
    CSVToJSON().fromFile('performance.csv')
    .then(data => {
        res.send(data)
    }).catch(e => {
        res.send(e);
    });
})

app.post("/import",(req,res)=>{

        const jsondata = req.body
        // jsondata.forEach(async function (item) {
        //     const performance = new Performance(item)
        //     performance.save()
        // })

        // mongoose.Collection.insertMany(jsondata).then(resp => res.send('created')).catch(err => console.log(err))
        PerformanceModel.insertMany(jsondata)
        .then(resp => res.send('created'))
            .catch(err => console.log(err))
    

        res.send('Data saved succesfully')
})

app.get("/analytics",  (req,res)=>{

    // query = {
    //     metric : 'cpu',
    //     aggr: 'p90'
    // }


    // const metric = req.query.metric
    // const aggr = req.query.aggr
    // const date = req.query.date

    var dateArr  = req.query.date
    let metric = req.query.metric
    let Aggr = req.query.Aggr
   
    var data =  PerformanceModel.find({ 'CounterName':metric}).exec()
    var data =  PerformanceModel.find({ 'CounterName':metric, 'date': {
            $gte: dateArr[0],
           $lte: dateArr[1]
         } }).exec()
    res.status(200).send(data)
  

})

app.get("/badperformance", (req, res) => {

    
    var dateArr  = req.query.date.split(',')
    let metric = req.query.metric
    let p90 = req.query.p90
   
    var data =  PerformanceModel.find({ 'CounterName':metric}).exec()
    var data =  PerformanceModel.find({ 'CounterName':metric, 'date': {
            $gte: dateArr[0],
           $lte: dateArr[1]
         },
         'P90':{$gte : p90 }}).exec()
    res.status(200).send(data)
  
})

// PerformanceModel.find()
















app.listen(3000,()=>{
    console.log('Server is running successfully!')
})