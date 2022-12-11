import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "reset-css"
import "@/assets/styles/global.scss"
import "default-passive-events"; //添加事件管理者'passive'，来阻止'touchstart'事件，让页面更加流畅。 解决chrome下的warning问题

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <App />
)
