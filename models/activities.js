const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// this table will hold all the activities of the customer such as:
// 1-taking a course
// 2-downloading a document
// 3-browsing a certain topic area. 
//
const Activities = new Schema({
   username: { 
      type: String, 
      required: true 
   },
   coursename: {              // this subject matter can be a course name or document name
                              // or a clicked area of interest
      type: String
   },
   completed:  {
      type: Boolean, 
      default: false
   },
   modulescompleted: {
         type: Number,
         default: 0
   },
   deliverymechanisim: {             // delivery mechanisim full online, online personal, or in person
      type: String,
      default: 'online'
   },
   certificateissuedate: {          // this can also be the action date of the downloiad or the click
                                    // by click we mean actionable marketting information or lead
      type: Date, 
      default: Date.now 
   }
}, {timestamps: true});


module.exports = mongoose.model('Activities', Activities);