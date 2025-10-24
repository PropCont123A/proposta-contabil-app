import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuração para ignorar erros de ESLint durante o build.
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅✅✅ NOVA CONFIGURAÇÃO ADICIONADA ✅✅✅
  // Autoriza o Next.js a carregar imagens do seu domínio do WordPress.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'propostacontabil.com.br',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
