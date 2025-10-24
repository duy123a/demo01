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
                        dashboard: path.resolve(__dirname, 'Assets/js/dashboard.js'),
                        equipment: path.resolve(__dirname, 'Assets/js/equipment.js'),
                        tickets: path.resolve(__dirname, 'Assets/js/tickets.js'),
                        parts: path.resolve(__dirname, 'Assets/js/parts.js'),
                        requests: path.resolve(__dirname, 'Assets/js/requests.js'),
                        purchasing: path.resolve(__dirname, 'Assets/js/purchasing.js'),
                        calendar: path.resolve(__dirname, 'Assets/js/calendar.js'),
                        traceability: path.resolve(__dirname, 'Assets/js/traceability.js'),
                        workflow: path.resolve(__dirname, 'Assets/js/workflow.js')
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
