/**************************************************
 * Created by nanyuantingfeng on 07/09/2017 15:15.
 **************************************************/
module.exports = async function (context) {
  let {babelOptions, rules} = context;
  babelOptions.plugins.push(['babel-plugin-import', {
    libraryName: 'antd',
    style: true
  }]);

  context.entry = {
    'index': './example/entry.js',
  };
};
