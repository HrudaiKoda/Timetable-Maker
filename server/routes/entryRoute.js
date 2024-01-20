
import express from "express";
import { Entry } from "../models/entriesModel.js";

import cors from 'cors';
import multer from 'multer';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';
import readXlsxFile from  'read-excel-file/node'

const __dirname = path.resolve();
const app = express();
const router = express.Router();

router.post('/',async (req,res) => {
try {
    if(!req.body.code || !req.body.slot || !req.body.name )
    {
    return res.status(400).send({message: 'all the fields are required'});
    }
    const newEntry = {
    name:req.body.name,
    code:req.body.code,
    slot:req.body.slot,
    };
    const entry = await Entry.create(newEntry);
    return res.status(201).send(entry);
} catch (error) {
    console.log(error.message);
    res.status(500).send({message: error.message});
}
});

router.get('/',async (req,res) => {
try{
const entrys = await Entry.find({});
return res.status(200).json(entrys);
} catch (error) {
console.log(error.message);
res.status(500).send({message: error.message});
}
});


router.get('/:id',async (req,res) => {
try{
    const {id} = req.params;
    const entrys = await Entry.findById(id);
    return res.status(200).json(entrys);
} catch (error) {
    console.log(error.message);
    res.status(500).send({message: error.message});
}
});


router.delete('/:id',async (req,res) => {
    try{
    const {id} = req.params;
    const result = await Entry.findByIdAndDelete(id);
    if(!result)
    {
        res.status(404).send({message: 'Entry not found'});
    }
    return res.status(200).json({message: 'Entry deleted successfully'});
    } catch (error) {
    console.log(error.message);
    res.status(500).send({message: error.message});
    }
    });



//import readXlsxFile from 'read-excel-file/node';

//const app = express();

const uploadDestination = 'uploads/';

// Ensure the upload destination folder exists
if (!fs.existsSync(uploadDestination)) {
    console.log(uploadDestination);
  fs.mkdirSync(uploadDestination);
}
const upload = multer({ dest: uploadDestination });

// Endpoint for file upload and database insertion
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Read the uploaded Excel file
    const entries = await readXlsxFile(req.file.path, { sheet: "Slotting" });
    
    const listOfJsonObjects = [];
    const regexPattern = /^[A-Za-z]{2}\d{4}$/;
    // Loop through the list of lists
    for (const innerList of entries) {
    // Create a JSON object with keys and values from the inner list
  

    if (regexPattern.test(innerList[1]) && innerList[4]) {
    
    const jsonObject = {
        code: innerList[1],
        name: innerList[2],
        slot: innerList[4],
    };
    listOfJsonObjects.push(jsonObject);
    }
   
    }
    const result = await Entry.updateMany({}, { $set: { isUsed: false } });

    await Entry.insertMany(listOfJsonObjects).then(function () {
        console.log("Data inserted") // Success 
    }).catch(function (error) {
        console.log(error)     // Failure 
    });

   // await Entry.bulkCreate(entries, { validate: true });

    // Respond with success
    res.json({ message: 'File uploaded and data inserted into the database.' });
  } catch (error) {
    console.error('Error processing file and inserting data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
export default router;
