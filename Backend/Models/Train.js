import mongoose from 'mongoose';

const stationSchema = new mongoose.Schema({
  code: String,
  name: String,
  arrival_time: { type: String, default: null },
  departure_time: { type: String, default: null },
});

const seatAvailabilitySchema = new mongoose.Schema({
  total: Number,
  available: Number,
  status: String,
});

const seatSchema = new mongoose.Schema({
  '1AC': seatAvailabilitySchema,
  '2AC': seatAvailabilitySchema,
  '3AC': seatAvailabilitySchema,
  SL: seatAvailabilitySchema,
  GEN: seatAvailabilitySchema,
});

const intermediateStationSchema = new mongoose.Schema({
  code: String,
  name: String,
  arrival_time: String,
  departure_time: String,
  stop : Number
});

const trainSchema = new mongoose.Schema({
  train_number: String,
  train_name: String,
  starting_station: stationSchema,
  terminating_station: stationSchema,
  intermediate_stations: [intermediateStationSchema],
  seat_availability: seatSchema,
});

const trainsNameSchema = new mongoose.Schema({
  station_code : String,
  station_name : String,
})

const stationGraphSchema = new mongoose.Schema({
  station_code: { type: String, required: true },
  stations_connected: [
    {
      station: { type: String, required: true },  
      trains: [Number], 
      connection_count: { type: Number, default: 0 }  
    }
  ]
});


const StationGraph = mongoose.model('StationGraph', stationGraphSchema);
const Train = mongoose.model('Train', trainSchema);
const TrainName = mongoose.model('Trains-Name' , trainsNameSchema);

export {
  Train,
  TrainName,
  StationGraph
} ;
