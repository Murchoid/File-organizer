import chalk from 'chalk';
import createLogger from '../logger.js';
import {promises as fs} from 'node:fs'; // Use the promise-based version of fs
import path from 'path';

const logger = createLogger('config:start');

export default async function start(directory) {
    try {
        await organizeFolder(directory);
    } catch (error) {
        logger.error(`Failed to start organizing: ${error.message}`);
    }
}

const organizeFolder = async (directory) => {
    const folders = {
        Documents: ['.pdf', '.doc', '.docx', '.txt'],
        Pictures: ['.jpg', '.jpeg', '.png', '.gif'],
        Music: ['.mp3', '.wav'],
        Videos: ['.mp4', '.mkv', '.avi'],
        Others: []
    };

    // Create folders if they don't exist
    await Promise.all(
        Object.keys(folders).map(async (folder) => {
            const folderPath = path.join(directory, folder);
            try {
                await fs.mkdir(folderPath, { recursive: true });
                logger.debug(`Created folder: ${folderPath}`);
            } catch (err) {
                logger.warning(`Unable to create folder ${folderPath}: ${err.message}`);
            }
        })
    );

    try {
        const files = await fs.readdir(directory);
        
        for (const file of files) {
            const filePath = path.join(directory, file);
            const stat = await fs.stat(filePath); // Get file stats
            const ext = path.extname(file).toLowerCase();

            // Skip if it's a directory
            if (stat.isDirectory()) {
                continue; // Skip processing this item
            }

            let moved = false;

            for (const [folder, exts] of Object.entries(folders)) {
                if (exts.includes(ext)) { 
                    try {
                        await fs.rename(filePath, path.join(directory, folder, file));
                        logger.debug(`Moved ${file} to ${folder}`);
                        moved = true;
                        break; // Exit the loop once the file is moved
                    } catch (error) {
                        logger.warning(`Error moving ${file} to ${folder}: ${error.message}`);
                    }
                }
            }

            // Move to 'Others' if not moved yet
            if (!moved) {
                try {
                    await fs.rename(filePath, path.join(directory, 'Others', file));
                    logger.debug(`Moved ${file} to Others`);
                } catch (error) {
                    logger.warning(`Error moving ${file} to Others folder: ${error.message}`);
                }
            }
        }
    } catch (err) {
        logger.warning(`Error reading directory ${directory}: ${err.message}`);
    }
};
