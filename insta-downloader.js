const fetch = require('node-fetch')
const util = require('util')
const fs = require('fs')
const readlineSync = require('readline-sync');
const streamPipeline = util.promisify(require('stream').pipeline)

const getString = (string, start, end) => {
    let str = string.split(start)
    str = str[1].split(end)
    return str[0]
}
const getContent = (url, nameFile, type) => new Promise((resolve, reject) => {
    fetch(url)
        .then(res => {
            if (type == 'video') {
                streamPipeline(res.body, fs.createWriteStream(`./${nameFile}.mp4`))
            } else {
                streamPipeline(res.body, fs.createWriteStream(`./${nameFile}.jpg`))
            }
        })
        .catch(err => resolve(err))
})


const getInfo = (url) => new Promise((resolve, reject) => {
    fetch(url)
        .then(res => res.text())
        .then(result => {
            let type = getString(result, '<meta name="medium" content="', '" />')
            let nameFile = readlineSync.question('File Name (without extension): ');
            let urlPost;
            if (type == 'video') {
                urlPost = getString(result, '<meta property="og:video" content="', '" />')
                getContent(urlPost, nameFile, 'video')
            } else {
                urlPost = getString(result, '<meta property="og:image" content="', '" />')
                getContent(urlPost, nameFile, 'image')
            }
            resolve("Success ambil info data!")
        })
        .catch(err => reject(err))
});
(async () => {
    let url = readlineSync.question('Masukan url post: ')
    let prosesData = await getInfo(url)
    console.log(prosesData)
})();
