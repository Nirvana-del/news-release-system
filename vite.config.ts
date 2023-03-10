import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import styleImport, {AntdResolve} from 'vite-plugin-style-import'
import path from "path"
// https://vitejs.dev/config/

export default defineConfig({
    plugins: [
        react(),
        styleImport({
            resolves: [
                AntdResolve()
            ]
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, './src')
        }
    },
    server: {
        // host: '0.0.0.0',//使用当前的IP地址，没有这个就是以localhost作为本地地址
        // port: 3000, //端口号为3000
        // open: false, //是否在默认浏览器中自动打开该地址
        proxy: { //使用代理
            '/api': { //当有 /api开头的地址是，代理到target地址
                target: 'http://47.92.160.213:8087', // 需要跨域代理的本地路径
                changeOrigin: true, //是否改变请求源头
                rewrite: path => path.replace(path, '')

            }
        }
    }
})
