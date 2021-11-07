const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favs = require('../models/favorite');

const favRouter = express.Router();
favRouter.use(bodyParser.json());

favRouter.route('/')
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
		Favs.findOne({ user: req.user._id })
		.populate('user')
		.populate('dishes')
		.exec((err, favs) => {
			if(err) return next(err);
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(favs);
		});
	})
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)  => {
		Favs.findOne({ user: req.user._id }, (err, favs) => {
			if(err) return next(err);

			if(!favs) {
				Favs.create({ user: req.user._id })
				.then((user_favs) => {
					for(var i of req.body) {
						if(user_favs.dishes.indexOf(i._id) === -1)
							user_favs.dishes.push(i._id);
					}
					user_favs.save()
					.then((user_favs) => {
						Favs.findById(user_favs._id)
						.populate('user')
						.populate('dishes')
						.then((favorites) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(favorites);
						})
						.catch((err) => next(err));
					})
					.catch((err) => next(err));
				})
				.catch((err) => next(err));
			}
			else {
				for(var i of req.body) {
					if(favs.dishes.indexOf(i._id) === -1)
						favs.dishes.push(i._id);
				}
				favs.save()
				.then((user_favs) => {
					Favs.findById(user_favs._id)
					.populate('user')
					.populate('dishes')
					.then((favorites) => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(favorites);
					})
					.catch((err) => next(err));
				})
				.catch((err) => next(err));
			}
		})
	})
	.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	 	res.statusCode = 403;
	 	res.setHeader('Content-Type', 'text/plain');
	 	res.end('PUT operation not supported on /favorites');
	})
	.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favs.find({})
		.populate('user')
		.populate('dishes')
		.then((favs) => {
			var user_favs;
            if (favs) {
                user_favs = favs.filter(fav => fav.user._id.equals(req.user._id))[0];
            } 
            if(user_favs){
                user_favs.remove()
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(resp);
                }, (err) => next(err));
                
            }
			else {
				var err = new Error('No favorites to delete!');
				err.status = 404;
				return next(err);
			}
		});
	});

favRouter.route('/:dishId')
	.options(cors.corsWithOptions, (req, res) => {
		res.sendStatus(200);
	})
	.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
		Favs.findOne({user: req.user._id})
		.then((favs) => {
			if(!favs) {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				return res.json({"exists": false, "favorites": favs});
			}
			else {
				if(favs.dishes.indexOf(req.params.dishId) < 0) {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					return res.json({"exists": false, "favorites": favs});
				}
				else {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					return res.json({"exists": true, "favorites": favs});
				}
			}
		}, (err) => next(err))
		.catch((err) => next(err))
	})
	.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favs.findOne({ user: req.user._id }, (err, favs) => {
			if(err) return next(err);

			if(!favs) {
				Favs.create({ user: req.user._id })
				.then((user_favs) => {
					user_favs.dishes.push({ "_id": req.params.dishId });
					user_favs.save()
					.then((user_favs) => {
						Favs.findById(user_favs._id)
						.populate('user')
						.populate('dishes')
						.then((favorites) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(favorites);
						})	
					})
					.catch((err) => next(err));
				})
				.catch((err) => next(err));
			}
			else {
				if(favs.dishes.indexOf(req.params.dishId) < 0) {
					favs.dishes.push({ "_id": req.params.dishId });
					favs.save()
					.then((user_favs) => {
						Favs.findById(user_favs._id)
						.populate('user')
						.populate('dishes')
						.then((favorites) => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json(favorites);
						})
						.catch((err) => next(err));
					})
					.catch((err) => next(err));
				}
				else {
					res.statusCode = 403;
					res.setHeader('Content-Type', 'text/plain');
					res.end('Dish ' + req.params.dishId + ' already exists!');
				}
			}
		})
	})
	.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	 	res.statusCode = 403;
	 	res.setHeader('Content-Type', 'text/plain');
	 	res.end('PUT operation not supported on /favorites/' + req.params.dishId);
	})
	.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
		Favs.findOne({ user: req.user._id }, (err, fav) => {
			if(err) return next(err);

			console.log(fav);
			var index = fav.dishes.indexOf(req.params.dishId);
			if(index >= 0) {
				fav.dishes.splice(index, 1);
				fav.save()
				.then((fav) => {
					Favs.findById(fav._id)
					.populate('user')
					.populate('dishes')
					.then((favorite) => {
						console.log('Favorite Dish Deleted!');
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(favorite);
					})
					.catch((err) => next(err));
				})
				.catch((err) => next(err));
			}
			else {
				res.statusCode = 404;
				res.setHeader('Content-Type', 'text/plain');
				res.end('Dish ' + req.params.dishId + ' not in your favorites!');
			}
		});
	});

module.exports = favRouter;