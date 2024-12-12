import {pathToFileURL} from 'url';
import chalk from 'chalk';
import { cosmiconfigSync } from 'cosmiconfig';
import schema from './schema.json' assert {type: 'json'};
import betterAjvErrors from 'better-ajv-errors';
import createLogger from '../logger.js';
const logger = createLogger('config:mgr');

import Ajv from 'ajv';

const ajv = new Ajv();

const configLoader = cosmiconfigSync('tool');

export default async function getConfig() {

  const result = configLoader.search(process.cwd());

    if (!result ) {
      logger.warning('Could not find configuration, using default');
      return {port: 3000};
    }
    else{
      const validate = ajv.compile(schema, result.config);
      if (!validate) {
        logger.warning('Invalid configuration, using default', ajv.errors);
        logger.warning(betterAjvErrors(schema, result.config, ajv.errors));

        return {port: 3000};
      }
      logger.highlight('Found configuration', result.config);
      return result.config;
    }

   
}
