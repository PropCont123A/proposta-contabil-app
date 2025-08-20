/** @type {import('next').NextConfig} */
const nextConfig = {
  // A configuração de images deve ficar DENTRO deste objeto
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
