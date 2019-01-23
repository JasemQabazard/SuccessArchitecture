const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// coursetopics schema
const topicsSchema = new Schema({
   coursename: { type: String, required: true },
   topic: {type: String},
   description:{type: String, default: ''},
   time:  {type: String, default: ''}
}, {timestamps: true});

const coursesSchema = new Schema({
   coursename: { 
      type: String, 
      required: true 
   },
   description: {
      type: String
   },
   modules: {                             // number of modules in the course
      type: Number,
      default: 0
   },
   coursetopics: [topicSchema],
   deliverymechanisim: [String],              // delivery full online, online personal, or in person
   certificatetype: {
      type: String, 
      default: 'A'                        //  A, B, or C
   },
   certificatesissued: {                  // number of certificates issued
      type: Number,
      default: 0
   },
   takenby: [String]                     // real names of certificates issued
}, {timestamps: true});

module.exports = mongoose.model('Courses', Courses);