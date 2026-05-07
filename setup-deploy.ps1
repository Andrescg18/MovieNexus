# MovieNexus Deployment Helper
Write-Host "🚀 Iniciando preparación para el deploy..." -ForegroundColor Cyan

# 1. Verificar Build
Write-Host "📦 Verificando que el proyecto compila..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build exitoso." -ForegroundColor Green
} else {
    Write-Host "❌ Error en el build. Revisa los errores arriba." -ForegroundColor Red
    exit
}

# 2. Opciones de Deploy
Write-Host "`n¿Dónde quieres desplegar tu app?" -ForegroundColor Cyan
Write-Host "1. Vercel (Recomendado para Angular)"
Write-Host "2. Netlify"
Write-Host "3. Docker / Railway"

$choice = Read-Host "Elige una opción (1-3)"

switch ($choice) {
    "1" {
        Write-Host "🚀 Desplegando en Vercel..." -ForegroundColor Yellow
        npx vercel --prod
    }
    "2" {
        Write-Host "🚀 Desplegando en Netlify..." -ForegroundColor Yellow
        npx netlify deploy --prod --dir=dist/MovieNexus/browser
    }
    "3" {
        Write-Host "🐳 Tu Dockerfile y nginx.conf ya están listos." -ForegroundColor Green
        Write-Host "Sube tu código a GitHub y conéctalo con Railway.app"
    }
    default {
        Write-Host "Opción no válida." -ForegroundColor Red
    }
}
