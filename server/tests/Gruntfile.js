module.exports = function(grunt) {

    grunt.initConfig({
	  simplemocha: {
		options: {
		  timeout: 3000
		},

		all: { src: ['business/*.js', 'helpers/*.js'] }
	  }
	});

	grunt.loadNpmTasks('grunt-simple-mocha');

	grunt.registerTask('default', ['simplemocha']);
};