import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';

// 初始化应用
function render(props) {
  const { container } = props;
  ReactDOM.render(
    <Root />,
    container ? container.querySelector('#root') : document.querySelector("#root")
  );
}

// 不是微服务直接render
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

// 微服务相关生命周期钩子
export async function bootstrap() {
  // console.log('[react16] react app bootstraped');
}
export async function mount(props) {
  // console.log('[react16] props from main framework');
  render(props);
}
export async function unmount(props) {
  // console.log('[react16] unmount from main framework');
  const { container } = props;
  ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector("#root"));
}