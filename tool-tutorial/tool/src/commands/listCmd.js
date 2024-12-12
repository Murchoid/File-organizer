import chalk from 'chalk';
import createLogger from '../logger.js';
import fs from 'fs';


const logger = createLogger('config:start');

export default function listFiles(config) {
  logger.highlight('  listing files  ');
  logger.debug('Received configuration in start -', config);


  fs.readdir(process.cwd(), (err, files)=>{
    if(err){
        logger.warning('Error reading files');
        return;
    }

    files.forEach(file=>{
        logger.highlight(file);
    })
  })

}