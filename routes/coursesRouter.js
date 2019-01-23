const express = require('express');
const bodyParser = require('body-parser');
const mogoose = require('mongoose');
const Courses = require('../models/courses');
const authenticate = require('../authenticate');
const cors = require('./cors');

const coursesRouter = express.Router();

coursesRouter.use(bodyParser.json());

coursesRouter.route('/') 
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
   Courses.find({})
   .then((courses) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(courses);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Courses.create(req.body)
   .then((course) => {
         console.log('course Created', course);
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(course);
   }, (err) => next(err))
   .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   res.statusCode = 403;
   res.end('PUT operation not supported on / Courses');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Courses.remove({})
   .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
   }, (err) => next(err))
   .catch((err) => next(err));
});

coursesRouter.route('/:courseId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
   Courses.findById(req.params.courseId)
    .then((course) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(course);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /Courses/'+ req.params.courseId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Courses.findByIdAndUpdate(req.params.courseId, {
        $set: req.body
    }, { new: true })
    .then((course) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(course);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Courses.findByIdAndRemove(req.params.courseId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

// for topics end points ================

coursesRouter.route('/:courseId/topics')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
   Courses.findById(req.params.courseId)
    .then((course) => {
        if (course != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(course.topic);
        }
        else {
            err = new Error('Courses ' + req.params.courseId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log(req.params.courseId, req.body);
    Courses.findById(req.params.courseId)
    .then((course) => {
        if (course != null) {
         course.topic.push(req.body);
         course.save()
            .then((course) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Course ' + req.params.courseId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /Courses/'
        + req.params.courseId + '/topics');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Courses.findById(req.params.courseId)
    .then((course) => {
        if (course != null) {
            for (var i = (course.topic.length -1); i >= 0; i--) {
               course.topic.id(course.topic[i]._id).remove();
            }
            course.save()
            .then((course) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Course ' + req.params.courseId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

coursesRouter.route('/:courseId/topic/:topicId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
   Courses.findById(req.params.courseId)
    .then((course) => {
        if (course != null && course.topics.id(req.params.topicId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(course.topics.id(req.params.topicId));
        }
        else if (course == null) {
            err = new Error('Course ' + req.params.courseId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Topic ' + req.params.topicId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /courses/'+ req.params.courseId
        + '/topics/' + req.params.topicId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Courses.findById(req.params.courseId)
    .then((course) => {
        if (course != null && course.topics.id(req.params.courseId) != null) {
            if (req.body.topic) {
               course.topics.id(req.params.courseId).topic = req.body.topic;                
            }
            course.save()
            .then((course) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course);                
            }, (err) => next(err));
        }
        else if (course == null) {
            err = new Error('Course ' + req.params.courseId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Topic ' + req.params.topicId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
   Courses.findById(req.params.courseId)
    .then((course) => {
        if (course != null && course.topics.id(req.params.topicId) != null) {
         course.topics.id(req.params.topicId).remove();
         course.save()
            .then((course) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(course);                
            }, (err) => next(err));
        }
        else if (course == null) {
            err = new Error('Course ' + req.params.courseId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Topic ' + req.params.topicId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = coursesRouter;
