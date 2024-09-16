import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import {diffLines} from 'diff';
import chalk from 'chalk';
import {Command} from 'commander';

const program = new Command();

class Nemo{

    constructor(repoPath = '.') {
        this.repoPath = path.join(repoPath, '.nemo');
        this.objectsPath = path.join(this.repoPath, 'objects'); // .nemo/objects
        this.headPath = path.join(this.repoPath, 'HEAD'); // .nemo/HEAD
        this.indexPath = path.join(this.repoPath, 'index'); // .nemo/index
        this.init();
    }

    async init(){
        await fs.mkdir(this.objectsPath, {recursive: true});
        try {
            await fs.writeFile(this.headPath, '', {flag: 'wx'}); //wx: open for writing. fails if file exists
            await fs.writeFile(this.indexPath, JSON.stringify([]), {flag: 'wx'});
        } catch (error) {
            console.log("Already initialised the .nemo folder")
        }
    }

    hashObject(content) {
        return crypto.createHash('sha1').update(content, 'utf-8').digest('hex');
    }

    async add(fileToBeAdded) {
        // fileToBeAdded: path/to/file
        const fileData = await fs.readFile(fileToBeAdded, {encoding: 'utf-8'}); // read teh file
        const fileHash = this.hashObject(fileData); // hash the file
        console.log(fileHash);
        const newFileHashedObjectPath = path.join(this.objectsPath, fileHash); // .nemo/objects/abc123
        await fs.writeFile(newFileHashedObjectPath, fileData);
        await this.updateStagingArea(fileToBeAdded, fileHash);
        console.log('Added ${fileToBeAdded}');

    }

    async updateStagingArea(filePath, fileHash) {
        const index = JSON.parse(await fs.readFile(this.indexPath, {encoding: 'utf-8'})); //read the index file
        index.push({path: filePath, hash: fileHash}); // add the file to the index
        await fs.writeFile(this.indexPath, JSON.stringify(index)); // write the updated index file
    } 

    async commit(message) {
        const index = JSON.parse(await fs.readFile(this.indexPath, {encoding: 'utf-8'}));
        const parentCommit = await this.getCurrentHead();

        const commitData = {
            timeStamp: new Date().toISOString(),
            message,
            files: index,
            parent: parentCommit 
        };  

        const commitHash = this.hashObject(JSON.stringify(commitData));
        const commitPath = path.join(this.objectsPath, commitHash);
        await fs.writeFile(commitPath, JSON.stringify(commitData));
        await fs.writeFile(this.headPath, commitHash); //update the HEAD to point to the new commit
        await fs.writeFile(this.indexPath, JSON.stringify([])); //clear the staging area
        console.log('Commit successfully created: ${commitHash}');

    }

    async getCurrentHead() {
        try{
            return await fs.readFile(this.headPath, {encoding: 'utf-8'});
        } catch(error) {

        }
    }

    async log() {
        let currentCommitHash = await this.getCurrentHead();
        while(currentCommitHash) {
            const commitData = JSON.parse(await fs.readFile(path.join(this.objectsPath, currentCommitHash), {encoding: 'utf-8'}));
            console.log('---------------');
            console.log(`Commit: ${currentCommitHash}`);
            console.log(`Date: ${commitData.timeStamp}`);
            console.log(`${commitData.message}`);
            console.log('---------------\n');
            currentCommitHash = commitData.parent;
        }
    }

    async showCommitDiff(commitHash) {
        const commitData = JSON.parse(await this.getCommitData(commitHash));
        if(!commitData) {
            console.log("Commit not found");
            return;
        }
        console.log("Changes in the last commit are: ");

        for(const file of commitData.files) {
            console.log(`File: ${file.path}`);
            const fileContent = await this.getFileContent(file.hash);
            console.log(fileContent);

            if(commitData.parent) {
                // get the parent commit data
                const parentCommitData = JSON.parse(await this.getCommitData(commitData.parent));
                const parentFileContent = await this.getParentFileContent(parentCommitData, file.path);
                if(parentFileContent !== undefined) {
                    console.log('\nDiff:');
                    const diff = diffLines(parentFileContent, fileContent);

                    // console.log(diff);

                    diff.forEach(part => {
                        if (typeof part.value === 'string') {
                        if(part.added) {
                            process.stdout.write(chalk.green("++" + part.value));
                        } else if(part.removed) {
                            process.stdout.write(chalk.red("--" + part.value));
                        } else {
                            process.stdout.write(chalk.grey(part.value));
                        }
                      }
                    });
                    console.log(); //new line
                } else {
                    console.log(chalk.yellow("New file in this commit"));
                } 

            } else {
                console.log(chalk.blue("First commit"));
            }

        }
    }

    async getParentFileContent(parentCommitData, filePath) {
        const parentFile = parentCommitData.files.find(file => file.path == filePath);
        if(parentFile) {
            //get the file content from the parent commit and return the content
            return await this.getFileContent(parentFile.hash);
        }
    }

    async getCommitData(commithash) {
        const commitPath = path.join(this.objectsPath, commithash);
        try {
            return await fs.readFile(commitPath, {encoding: 'utf-8'});
        } catch(error) {
            console.log("Failed to read the commit data", error);
            return null;
        }
    }

    async getFileContent(fileHash) {
        const objectPath = path.join(this.objectsPath, fileHash);
        return fs.readFile(objectPath, {encoding: 'utf-8'});
    }



}

// (async () => {
//     const nemo = new Nemo();
//     // await nemo.add('sample.txt');
//     // await nemo.add('sample2.txt');
//     // await nemo.commit('Fourth commit');

//     // await nemo.log();
//     await nemo.showCommitDiff('3d94187224d28b5b3492062f6076d2bf917e6bfd');
// })();

program.command('init').action(async () => {
    const nemo = new Nemo();
});

program.command('add <file>').action(async (file) => {
    const nemo = new Nemo();
    await nemo.add(file);
});

program.command('commit <message>').action(async (message) => {
    const nemo = new Nemo();
    await nemo.commit(message);
});

program.command('log').action(async () => {
    const nemo = new Nemo();
    await nemo.log();
});

program.command('show <commitHash>').action(async (commitHash) => {
    const nemo = new Nemo();
    await nemo.showCommitDiff(commitHash);
});

// console.log(process.argv);
program.parse(process.argv);