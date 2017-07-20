
import {join} from 'path';
import Rubik from '../src';
const rubik = new Rubik({
    headless: false
});

console.log(rubik);

rubik.start('file://' + join(__dirname, '/page/index.html'))
    .getTitle()
    // .getCurrentUrl()
    // .getDOMLength()
    // .getDOMCounters()
    .start('https://github.com')
    .getCurrentUrl()
    .getCurrentUrl()
    .result(ret => {
        rubik.end();
        console.log();
        console.log('ret', ret);
    })
    .catch(e => {
        console.log(133311, e);
    })

// rubik.start('https://github.com')
//     .getCurrentUrl()
//     // .getDOMLength()
//     // .getDOMCounters()
//     .result(ret => {
//         console.log();
//         console.log('ret', ret);
//     })
//     .catch(e => {
//         console.log(333, e);
//     })

// 回调函数形式
// rubik.start('file://' + join(__dirname, '/page/index.html'), () => {
    // 回调函数形式
    // rubik.getTitle(ret => {
    //     console.log('example', ret);
    // });

    // promise then 形式
    // rubik.getTitle().then(ret => {
    //     console.log('111', ret);
    // });
// });

// promise then 形式
// rubik.start('file://' + join(__dirname, '/page/index.html')).then(() => {
    // 回调函数形式
    // rubik.getTitle(ret => {
    //     console.log('example', ret);
    // });

    // promise then 形式
    // rubik.getTitle().then(ret => {
    //     console.log('111', ret);
    // });
// });

// async await 形式
// async function main() {
//     await rubik.start('file://' + join(__dirname, '/page/index.html'));
//     // async await 形式
//     const ret = await rubik.getTitle();
//     console.log(ret);

//     // promise then 形式
//     rubik.getTitle().then(ret => {
//         console.log('111', ret);
//     });

//     // 回调函数形式
//     rubik.getTitle(ret => {
//         console.log('example', ret);
//     });
// }
// main();


// console.log(rubik);
// console.log(Rubik.addCustomDevice);
// async function main() {
    // rubik.start('file://' + join(__dirname, '/page/index.html'));
    // const ret = rubik.getTitle().then(function () {console.log(arguments);});
    // console.log(ret);
// }
// main();

// const result = await chromy.evaluate(() => {
//         return document.querySelectorAll('*').length
//     });


// import fs from 'fs';
// import Chromy from 'chromy';

// async function main() {
//     // let chromy = new Chromy({
//     //     // visible: true
//     // });
//     // await chromy.goto('http://ielgnaw.com/')
//     // const result = await chromy.evaluate(() => {
//     //     return document.querySelectorAll('*').length
//     // });
//     // console.log(result)
//     // await chromy.close();

//     let chromy = new Chromy()
//     chromy.chain()
//       .goto('https://github.com')
//       .screenshot()
//       .result((png) => {
//         fs.writeFileSync('out.png', png)
//       })
//       .screenshotDocument() // take screenshot of whole document
//       .result((png) => {
//         fs.writeFileSync('out_doc.png', png)
//       })
//       .pdf()
//       .result((pdf) => {
//         fs.writeFileSync('out.pdf', pdf)
//       })
//       .end()
//       .then(_ => chromy.close())
//       .catch(e => {
//         console.log(e)
//         chromy.close()
//       })
// }

// main()
