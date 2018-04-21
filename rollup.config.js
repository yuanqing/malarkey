import uglify from 'rollup-plugin-uglify';

export default {
  plugins: [
    uglify(),
  ],
  input: 'index.js',
  output: [{
    file: 'cjs/index.js',
    format: 'cjs',
  }, {
    file: 'malarkey.min.js',
    format: 'es',
  }],
};
