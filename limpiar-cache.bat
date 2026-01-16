@echo off
echo ========================================
echo  LIMPIAR CACHE Y REINICIAR SERVIDOR
echo ========================================
echo.

REM Detener todos los procesos de Node.js
echo [1/4] Deteniendo servidor...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

REM Agregar timestamp a commerce-api.js para forzar recarga
echo [2/4] Actualizando archivos con timestamp...
powershell -Command "(Get-Content 'public\js\commerce-api.js') -replace 'export const commerceAPI', '// Updated: %date% %time%\nexport const commerceAPI' | Set-Content 'public\js\commerce-api.js'"

REM Iniciar servidor
echo [3/4] Iniciando servidor...
start /B node src\server.js

REM Esperar
timeout /t 3 /nobreak >nul

echo [4/4] Servidor iniciado en puerto 3000
echo.
echo ========================================
echo  INSTRUCCIONES:
echo ========================================
echo.
echo 1. Abre tu navegador
echo 2. Ve a: http://localhost:3000/admin-panel.html
echo 3. Presiona Ctrl + Shift + R (hard refresh)
echo 4. O abre DevTools (F12) ^> Application ^> Clear Storage ^> Clear site data
echo.
echo Presiona cualquier tecla para cerrar...
pause >nul
