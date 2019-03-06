'use strict';

const Pictogram = require('../models/pictogram');

function getPictograms (req, res){
    Pictogram.find({}, (err, pictograms) => {
        if(err) return res.status(400).send({message: `Bad request: ${err} `});
        if(!pictograms) return res.status(404).send({message: 'Empty database'});
        res.status(200).send({pictograms})
    });
}

function getPictogram (req, res){
    let pictogram_id = req.params.pictogram_id;

    Pictogram.findById(pictogram_id, (err, pictogram) => {
        if(err) return res.status(400).send({message: `Bad request: ${err}`});
        if(!pictogram) return res.status(404).send({message: 'Pictogram not found.'});
        res.status(200).send({pictogram})
    })
}

function savePictogram (req, res){
    //console.log('POST /api/pictograms');
    //console.log(req.body);

    let pictogram = new Pictogram();
    pictogram.name = req.body.name;
    pictogram.description = req.body.description;
    pictogram.img = req.body.img;
    pictogram.sound = req.body.sound;
    pictogram.category = req.body.category;

    pictogram.save((err, pictogramStored) => {
        if(err) res.status(500).send({message: `Error al salvar en la base de datos: ${err}`});
        res.status(200).send({pictogram: pictogramStored})
    })
}

function updatePictogram (req, res) {
    let pictogram_id = req.params.pictogram_id;
    let update = req.body;

    Pictogram.findOneAndUpdate({_id: pictogram_id}, update, (err, pictogramUpdated) => {
        if(err) return res.status(400).send({message: `Bad request: ${err}`});
        res.status(200).send({prictogram: pictogramUpdated})
    })
}

function deletePictogram (req, res) {
    let pictogram_id = req.params.pictogram_id;

    Pictogram.findById(pictogram_id, (err, pictogram) => {
        if(err) return res.status(400).send({message: `Bad request: ${err}`});

        pictogram.remove(err => {
            if(err) return res.status(400).send({message: `Bad request: ${err}`});
            res.status(200).send({message: 'Sucessfully deleted'})
        })
    })
}

module.exports = {
    getPictograms,
    getPictogram,
    savePictogram,
    updatePictogram,
    deletePictogram
};