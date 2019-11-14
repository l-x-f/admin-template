import Vue from 'vue'
const requireComponent = require.context('.', true, /\.vue$/)
// console.log(requireComponent)
// console.log(requireComponent.resolve())
requireComponent.keys().forEach(
  (filePath) => {
    const componentName = (filePath.substring(2)).split('.')[0]
    Vue.component(componentName, requireComponent(filePath).default)
  }
)
