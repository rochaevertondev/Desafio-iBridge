import { defineConfig, loadEnv } from 'vite';

export default defineConfig(async ({ mode }) => {
 
  const env = loadEnv(mode, process.cwd(), '');
  const react = (await import('@vitejs/plugin-react')).default;

  return {
    plugins: [react()],
    server: {
      port: Number(env.VITE_PORT) || 5173,
    },
  };
});
