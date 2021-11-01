const express = require('express')
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const json = require('csvtojson')
const MongoClient = mongodb.MongoClient

const url = "mongodb://localhost:27017/Performance"
mongoose
    .connect(url, { useNewUrlParser: true })
    .then(() => {
        console.log("Mongo DB Connected")
    })

const app = express()
app.use(express.json({limit : '50mb'}))
app.use(express.urlencoded({limit: '50mb'}))
const PerformanceSchema = mongoose.Schema({
        id:{type: Number},
        date:{type:Date},
        P90:{type: Number},
        P80:{type: Number},
        AVG:{type:Number},
        MAX:{type:Number},
        CounterName:{type: String},
        Total:{type: String},
        createdAt: {type:Date, default:Date.now},
        updatedAt: {type: Date, default:Date.now},
        resource_name:{type: String, requires: true}
})

const Performance = mongoose.model('Performance', PerformanceSchema)


app.get('/csvtojson',(req,res)=>{
    json().fromFile('performance.csv')
    .then(data => {
        res.send(data)
    }).catch(e => {
        res.send(e);
    });
})


app.post("/import", async (req, res) => {
    try {
        
        data = req.body
        
       data.forEach(async function (item){
            const performance = new Performance(item)
            await performance.save();
       });
    
        res.status(200).send('Data saved succesfully')
    } catch (err) {
        console.error(err)
        res.status(500).send('Invalid Data')
    }
});

app.get("/analytics", async (req, res) => {
    try {

        var dateArr = req.query.date.split(',')
        var start = new Date(dateArr[0])
        var end = new Date(dateArr[1])
        var metric = req.query.metric
        var Aggr = req.query.Aggr
        //let p90 = req.query.p90
        var filteration = [
            {
                $match: {
                    
                    "CounterName":metric,
                     "date":{
                        $gte: start,
                        $lte: end
                    }
                }
            },
            {
              $group: {
                _id: Aggr,
                max: { $max: '$'+Aggr}
              }
            }
          ]
        var aggregatefun = await Performance.aggregate(filteration);
        console.log(aggregatefun)
       
        res.status(200).send(aggregatefun)
    } catch (err) {
        console.error(err)
        res.status(500).send('Invalid Data')
    }
})

app.get("/badperformance", async (req, res) => {
    try {

        var dateArr = req.query.date.split(',')
        let metric = req.query.metric
        let p90 = req.query.p90

        var data = await Performance.find({
            'CounterName': metric, 'date': {
                $gte: dateArr[0],
                $lte: dateArr[1]
            },
            'P90': { $gte: p90 }
        }).exec()
        res.status(200).send(data)
         } catch (err) {
        console.error(err)
         res.status(500).send('Invalid Data')
    }
})
















app.listen(3000,()=>{
    console.log('Server is running successfully!')
})