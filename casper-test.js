var casper = require("casper").create()
casper.start('https://www.baidu.com/', function () {
    this.fill('form[id="form"]', {
        'wd': 'ajax',
    }, true);
});
// casper.thenClick('input#su');
casper.then(function() {
    this.echo('Page url is ' + this.getCurrentUrl());
    this.echo('Page title is ' + this.getTitle());
});

casper.run();
