@echo off
cls
echo ========================================
echo   🚀 Iniciando Frontend Desktop (Windows)
echo ========================================
echo.
echo Verificando dependencias...
call npm install
if %errorlevel% neq 0 (
  echo Error al instalar dependencias.
  exit /b 1
)
echo Dependencias listas.
echo.
echo Iniciando aplicacion con Electron...
call npm run electron
