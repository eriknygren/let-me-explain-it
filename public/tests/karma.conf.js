// Karma configuration
// Generated on Wed Aug 14 2013 12:55:15 GMT+0200 (W. Europe Daylight Time)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '../',


    // frameworks to use
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        "https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false",
        "https://static.vline.com/vline.js",
        "js/lib/jquery/jquery-2.0.3.min.js",
        "js/lib/jquery-cookie/jquery.cookie.js",
        "js/lib/angular-file-upload/angular-file-upload-html5-shim.min.js",
        "js/lib/angularjs/angular.min.js",
        "js/lib/angularjs/angular-mocks.js",
        "js/lib/angular-file-upload/angular-file-upload.min.js",
        "js/lib/bootstrap/js/bootstrap.js",
        "js/lib/angular-ui-bootstrap/ui-bootstrap-tpls-0.4.0.js",
        "js/lib/colorpicker/bootstrap-colorpicker.js",
        "js/lib/colorpicker/bootstrap-colorpicker-module.js",
        "js/app.js",
        { pattern: 'js/controllers/*.js', included: true },
        { pattern: 'js/directives/*.js', included: true },
        { pattern: 'js/services/*.js', included: true },
        { pattern: 'tests/mocks/*/*.js', included: true },
        { pattern: 'tests/*/*.spec.js', included: true }
    ],


    // list of files to exclude
    exclude: [
      
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],
	
   plugins: [
		'karma-chrome-launcher',
		'karma-jasmine'
		],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
