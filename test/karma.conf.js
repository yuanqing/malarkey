module.exports = function (config) {
  config.set({
    basePath: '..',
    autoWatch: true,
    frameworks: ['jasmine'],
    browsers: ['PhantomJS'],
    plugins: [
      'karma-coverage',
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-spec-reporter'
    ],
    reporters: [
      'coverage',
      'spec'
    ],
    coverageReporter: {
      type: 'lcov',
      dir: '../coverage/'
    },
    preprocessors: {
      'dist/kontact.min.js': ['coverage']
    },
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
      'node_modules/sinon/pkg/sinon-1.11.1.js',
      'dist/malarkey.min.js',
      'test/spec/malarkey.spec.js',
      {pattern: 'test/fixture/fixture.html', watched: false, included: false, served: true}
    ]
  });
};
