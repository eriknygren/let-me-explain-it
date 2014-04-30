module.exports = function(grunt) {

    grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['../public/js/app.js', '../public/js/controllers/*.js', '../public/js/directives/*.js', '../public/js/services/*.js'],
                dest: '../public/dist/<%= pkg.name %>-min.js'
            }
        },
		ngmin: {
			  angularApp: {
				src: '../public/dist/<%= pkg.name %>-min.js',
				dest: '../public/dist/<%= pkg.name %>-min.js'
			  }
			},
        uglify: {
            options: {
                banner: '/*!<%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    '../public/dist/<%= pkg.name %>-min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
		cssmin: {
			combine: {
				files: {
					  '../public/dist/<%= pkg.name %>-min.css': ['../public/css/*.css']
					}
				}
			}
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	
    grunt.registerTask('default', ['concat', 'ngmin', 'uglify', 'cssmin']);
};