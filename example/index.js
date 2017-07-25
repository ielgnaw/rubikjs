
import {join} from 'path';
import Rubik from '../src';
import {readFileSync} from 'fs';

const rubik = new Rubik({
    headless: false,
    onError: e => {
        console.log(1111, e);
    }
});


async function main() {
    const ret = await rubik.start('file://' + join(__dirname, '/page/index.html'));
    console.log('ret', ret);

    const currentUrl = await rubik.getCurrentUrl();
    console.log('currentUrl', currentUrl);

    const title = await rubik.getTitle();
    console.log('title', title);

    const clickRet = await rubik.click('button#btn');
    console.log('clickRet', clickRet);

    const fileContent = readFileSync(join(__dirname, './jquery.min.js'), {encoding: 'utf8'});
    const addScriptRet = await rubik.addScript(fileContent);
    console.log('addScriptRet', addScriptRet);

    const executeScriptRet = await rubik.executeScript(() => $().jquery);
    console.log('executeScriptRet', executeScriptRet);

    // const ret1 = await rubik.start('https://www.baidu.com');
    // console.log('ret1', ret1);
    // const currentUrl1 = await rubik.getCurrentUrl();
    // console.log('currentUrl1', currentUrl1);
    // const title1 = await rubik.getTitle();
    // console.log('title1', title1);
}

main();
