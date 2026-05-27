const fs = require('fs');

// process.env.API_KEY leerá la variable que configuraste en Vercel
const envConfigFile = `export const environment = {
  production: true,
  apiUrl: 'https://api.themoviedb.org/3',
  imageUrl: 'https://image.tmdb.org/t/p',
  apiKey: '${process.env.API_KEY || ''}',
  // Soporte para los nombres del manual pedagógico
  baseUrl: 'https://api.themoviedb.org/3',
  imgPath: 'https://image.tmdb.org/t/p'
};
`;

const targetFolderPath = './src/environments';
if (!fs.existsSync(targetFolderPath)) {
  fs.mkdirSync(targetFolderPath, { recursive: true });
}
const targetPath = './src/environments/environment.ts';
fs.writeFileSync(targetPath, envConfigFile);
console.log('✅ Archivo environment.ts generado correctamente en Vercel.');
