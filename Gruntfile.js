module.exports = function (grunt) {	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		less: {
			options: {
				banner: grunt.file.read('header.txt')
			},
			dist: {
				files: {
					'popup.css': 'popup.less'
				}
			}
		},
		watch: {
			files: [ 'Gruntfile.js', 'popup.less' ],
			tasks: [ 'less' ]
		}
	});
	
	grunt.registerTask('default', [
		'less',
		'watch'
	]);
	
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
};
