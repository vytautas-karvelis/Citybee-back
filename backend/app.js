// Requiring packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Model = require("./models/model.js")
const Vehicle = require("./models/vehicle.js")
require('dotenv').config();

const app = express();

const PORT = process.env.PORT;

// Connecting to DB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((res) => {
    // Starting server
    app.listen(PORT, () => console.log(`Server is runing on port ${PORT}...`));
  })
  .catch((err) => console.log(err));

// Middlewares
app.use(cors());
app.use(express.json());

app.get('/models', async (req, res)=>{
    let models = await Model.find({})
    let vehicles = await Vehicle.find({})
    res.json(models)
    // console.log( models)
    // console.log('----')
    // console.log( vehicles)
  
    // let result = []
    // models.forEach(model=>{
    //     filteredVehicles = vehicles.filter(vehicle=>vehicle.model_id === model._id.toString())
    //     console.log(filteredVehicles.length)
    //     result.push({
    //         modelName:model['name'],
    //         vehicleCount:filteredVehicles.length
    //     })
    // })
    // console.log("result", result)
})

app.post('/models', (req, res)=>{
    if (!req.body.name || !req.body.hour_price) {
        res.status(400).json({ message: 'All fields are required' });
        return;
      }
      // -- if valdiation passes, adding new car
      const model = new Model(req.body);
    
      model
        .save()
        .then((data) => {
          res.json({ message: 'New model added!' });
        })
        .catch((err) => console.log(err));
})

app.get('/modelscount', async (req, res)=>{
   let models = await Model.find({})
   let vehicles = await Vehicle.find({})

   let result = []
   models.forEach(model=>{
       filteredVehicles = vehicles.filter(vehicle=>vehicle.model_id === model._id.toString())
       console.log(filteredVehicles.length)
       result.push({
           modelName:model['name'],
           vehicleCount:filteredVehicles.length
       })
   })
   console.log(result)
   res.json(result)

})

app.get('/vehicles', async (req, res)=>{
    let vehicles = await Vehicle.find({})
    let models = await Model.find({})

    let reducedVehicles = vehicles.reduce((total, currentItem)=>{

        let specificModel = models.find(model=> model._id.toString() === currentItem.model_id.toString())
        
        let priceBeforeVat = specificModel.hour_price 
        let priceAfterVat
        switch(currentItem.country_location){
            case "lt":
                priceAfterVat = priceBeforeVat *1.21
            break
            case "lv":
                priceAfterVat = priceBeforeVat *1.21
            break
            case "ee":
                priceAfterVat = priceBeforeVat *1.20
            break
        }
        let name = specificModel.name

        let obj = {
            _id:currentItem._id,
            model_name:name,
            hour_price:priceAfterVat.toFixed(2),
            number_plate:currentItem.number_plate,
            country_location:currentItem.country_location
        }

        total.push(obj)

        return total
    }, [])

    console.log(reducedVehicles)
    res.json(reducedVehicles)
})

app.get('/vehicles/:cty', async (req, res)=>{
    let vehicles = await Vehicle.find({country_location:req.params.cty})
    let models = await Model.find({})

    let reducedVehicles = vehicles.reduce((total, currentItem)=>{

        let specificModel = models.find(model=> model._id.toString() === currentItem.model_id.toString())
        
        let priceBeforeVat = specificModel.hour_price 
        let priceAfterVat
        switch(currentItem.country_location){
            case "lt":
                priceAfterVat = priceBeforeVat *1.21
            break
            case "lv":
                priceAfterVat = priceBeforeVat *1.21
            break
            case "ee":
                priceAfterVat = priceBeforeVat *1.20
            break
        }
        let name = specificModel.name

        let obj = {
            _id:currentItem._id,
            model_name:name,
            hour_price:priceAfterVat.toFixed(2),
            number_plate:currentItem.number_plate,
            country_location:currentItem.country_location
        }

        total.push(obj)

        return total
    }, [])

    console.log(reducedVehicles)
    res.json(reducedVehicles)
})

app.post('/vehicles', (req, res)=>{
    if (!req.body.model_id || !req.body.country_location || !req.body.number_plate) {
        res.status(400).json({ message: 'All fields are required' });
        return;
      }
      // -- if valdiation passes, adding new car
      const vehicle = new Vehicle(req.body);
    
      vehicle
        .save()
        .then((data) => {
          res.json({ message: 'New vehicle added!' });
        })
        .catch((err) => console.log(err));
})

