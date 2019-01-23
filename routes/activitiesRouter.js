const express = require('express');
const bodyParser = require('body-parser');
const mogoose = require('mongoose');
const Activities = require('../models/activities');
const authenticate = require('../authenticate');
const cors = require('./cors');

const activitiesRouter = express.Router();

activitiesRouter.use(bodyParser.json());

activitiesRouter.route('/') 
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
   Activities.find({})
   .then((activities) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(activities);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Activities.create(req.body)
   .then((activity) => {
         console.log('activity Created', activity);
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(activity);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   res.statusCode = 403;
   res.end('PUT operation not supported on / Activities');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Activities.remove({})
   .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
   }, (err) => next(err))
   .catch((err) => next(err));
});

activitiesRouter.route('/:activityId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
   Activities.findById(req.params.courseId)
    .then((activity) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(activity);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /Activities/'+ req.params.activityId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Activities.findByIdAndUpdate(req.params.activityId, {
        $set: req.body
    }, { new: true })
    .then((activity) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(activity);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Activities.findByIdAndRemove(req.params.activityId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = activitiesRouter;
