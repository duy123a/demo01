import { defineConfig } from 'vite'
import path from 'path'
import dns from 'node:dns'

dns.setDefaultResultOrder('ipv4first')

export default defineConfig({
    appType: 'custom',
    root: path.resolve(__dirname, 'Assets'),
    base: '/dist/',
    build: {
        manifest: true,
        outDir: path.resolve(__dirname, 'wwwroot/dist'),
        emptyOutDir: true,
        assetsDir: '',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'Assets/js/main.js'),
                'notification': path.resolve(__dirname, 'Assets/js/notification.js'),
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]',
            },
        },
    },
    server: {
        port: 5173,
        strictPort: true,
        hmr: {
            clientPort: 5173
        }
    }
})
