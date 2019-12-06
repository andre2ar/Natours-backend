const fs = require('fs');
const Tour = require("./../models/tourModel");

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
};

exports.getTour = (req, res) => {
    const id = parseInt(req.params.id);
    const tour = tours.find(el => el.id === id);

    if(!tour){
        return res.status(404).json({
            status: "fail",
            message: "Not found"
        })
    }

    res.status(200).json({
        status: 'success',
        results: 1,
        data: {
            'tours': tour
        }
    });
};

exports.createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);

    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
};

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: "success",
        data:{
            tour: "updated tour here"
        }
    })
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    })
};

