const execBuffer = require('exec-buffer');
const mozjpeg = require('mozjpeg');
const jpegtran = require('jpegtran-bin');
const optipng = require('optipng-bin');
const cwebp = require('cwebp-bin');
const fs = require('fs');
const execa = require('execa');

module.exports = {
    async generateJpg(fileBuffer, quality = 75) {
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
    async generatePng(fileBuffer, effort = 2 ) {
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
    async generateWebp(fileBuffer,effort = 4,quality = 75){
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
    },
    calcSize(size) {
        if(size >= 1024 * 1024) {
            return (size / (1024 * 1024)).toFixed(2) + 'M';
        } else if(size >= 1024){
            return (size / 1024).toFixed(1) + 'KB';
        } else {
            return size + 'B';
        }
    },
    calcRatio(origin,compress) {
        return Math.round(((origin - compress) / origin) * 100).toFixed(0) + '%';
    },
    generateBlob(data,mine) {
        return new Blob([data],{type: mine});
    },
};
