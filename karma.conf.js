module.exports = function(config) {
  config.set({
    basePath: '.',
    autoWatch: true,
    frameworks: ['jasmine', 'browserify'],
    browsers: ['PhantomJS'],
    plugins: [
      'browserify-istanbul',
      'karma-browserify',
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
      dir: 'coverage/',
      subdir: '.',
      reporters: [
        { type: 'lcov' },
        { type: 'text' },
      ]
    },
    preprocessors: {
      'test/*.spec.js': ['browserify']
    },
    browserify: {
      transform: [
        [
          'browserify-istanbul',
          {
            ignore: ['**/node_modules/**', '**/test/**'],
            defaultIgnore: true
          }
        ]
      ]
    },
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
      'node_modules/sinon/pkg/sinon-1.11.1.js',
      'test/*.spec.js',
      {
        pattern: 'test/fixture.html',
        included: false,
        served: true,
        watched: false
      }
    ]
  });
};
