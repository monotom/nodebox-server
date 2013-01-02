var reporter = require('nodeunit').reporters.minimal;

//process.chdir(__dirname);

reporter.run(['app.js', 'handler.js']);