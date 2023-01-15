import {fetch} from 'node-fetch'
import path, { parse } from 'path';

const fs = require('fs');

export default function download (req, res){
   

  //const jsonDirectory = path.join(process.cwd(), '/public/data');
  const jsonPath = path.resolve('./data/character.json');
  const prettier = require('prettier')

   
  if (fs.existsSync(jsonPath)) {
    let jsonData = fs.readFileSync(jsonPath, 'utf-8');

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-disposition', 'attachment; filename=character.json');
    res.send(jsonData);
  }
  else {

    res.status(500).send();
  }
    

    

    // fs.readFile(newPath, 'utf8', (err, data) => {
    //   if (err) {
    //     res.status(500).send(err);
    //   } else {
    //     res.setHeader('Content-Type', 'application/json');
    //     res.setHeader('Content-disposition', 'attachment; filename=character.json');
    //     res.send(data);
    //   }
    // })

  
    //res.status(200).json({ message: 'Hello from the server' })
  }