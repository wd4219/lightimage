const execBuffer = require('exec-buffer');
const mozjpeg = require('mozjpeg');
const jpegtran = require('jpegtran-bin');
const optipng = require('optipng-bin');
const cwebp = require('cwebp-bin');
const fs = require('fs');
const execa = require('execa');

module.exports = {
    async generateJpeg(quality = 75,filePath) {
        let fileBuffer = fs.readFileSync(filePath);
        let args = ['-copy', 'none', '-optimize'];
        args.push('-outfile', execBuffer.output, execBuffer.input);
        let input = await execBuffer({
            input: fileBuffer,
            bin: jpegtran,
            args
        }).catch(error => {
            error.message = error.stderr || error.message;
            throw error;
        });
        let mozArgs = ['-quality', quality];
        mozArgs.push('-outfile', execBuffer.output, execBuffer.input);
        return execBuffer({
            input,
            bin: mozjpeg,
            args: mozArgs
        }).catch(error => {
            error.message = error.stderr || error.message;
            throw error;
        });
    },
    async generatePng(effort = 2 ,filePath) {
        let fileBuffer = fs.readFileSync(filePath);
        const args = [
            '-strip',
            'all',
            '-clobber',
            '-fix',
            '-o',
            effort,
            '-out',
            execBuffer.output
        ];
        args.push(execBuffer.input);
        return execBuffer({
            input:fileBuffer,
            bin: optipng,
            args
        }).catch(error => {
            error.message = error.stderr || error.message;
            throw error;
        });
    },
    async generateWebp(effort,quality,filePath){
        let fileBuffer = fs.readFileSync(filePath);
        let args = [];
        args.push('-q', quality);
        args.push('-m', effort)
        args.push('-o', execBuffer.output, execBuffer.input);
        return execBuffer({
            input: fileBuffer,
            bin: cwebp,
            args
        }).catch(error => {
            error.message = error.stderr || error.message;
            throw error;
        });
    }
};
