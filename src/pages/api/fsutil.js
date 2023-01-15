import {fetch} from 'node-fetch'
import path from 'path'

export default function fsutil (req, res){
    // Your server-side logic here
    // You can use req to access the request information
    // and use res to send a response
    const fs = require('fs')
    const prettier = require('prettier')

    var dialogues = req.body
    
    //const jsonDirectory = path.join(process.cwd(), 'public/data');
    //console.log(jsonDirectory)
    //console.log(__dirname)
    // const jsonDirectory = path.resolve(__dirname,'data');
    const jsonPath = path.resolve('./data/character.json');
    console.log(jsonPath)

    try{
      // fs.writeFile(
      //   jsonDirectory+'\\character.json',
      //   prettier.format(JSON.stringify(dialogues, null, 2), { parser: "json" })
      // );
      if (fs.existsSync(jsonPath)) {fs.chmodSync(jsonPath,'777')}
      fs.writeFileSync(jsonPath,prettier.format(JSON.stringify(dialogues,null,2), {parser: "json"})
      );

      
    }
    catch(error){
      console.error(error);
    }

    
    res.status(200).json({ message: 'Hello from server' })
  }