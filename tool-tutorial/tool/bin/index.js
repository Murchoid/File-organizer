#!/usr/bin/env node
import arg from 'arg';
import chalk from 'chalk';
import getConfig from '../src/config/config-mgr.js';
import start from '../src/commands/start.js';
import listFiles from '../src/commands/listCmd.js';
import createLogger from '../src/logger.js';
import fs from 'fs';
import path from 'path';
const logger = createLogger('bin');


try {
  const args = arg({
    '--start': String,
    '--build': Boolean,
    '--ls': Boolean,
    '-l': '--ls',
  });

  logger.debug('Received arguments-', args);

  if (args['--start']) {
    const directory = path.resolve(args['--start']);
    if (!directory || !fs.existsSync(directory)) {
      console.error('Please provide a valid directory using --start.');
      process.exit(1);
  }
    start(directory);
  }
  if(args['--ls']){
    listFiles();
  }
} catch (e) {
  logger.highlight(chalk.yellow(e.message));
  console.log();
  usage();
}

function usage() {
  console.log(`${chalk.whiteBright('tool [CMD]')}
  ${chalk.greenBright('--start')}\tStarts the app
  ${chalk.greenBright('--build')}\tBuilds the app`);
}