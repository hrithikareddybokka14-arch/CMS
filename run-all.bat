@echo off
title College Management System - Launcher
echo ===================================================
echo Starting Complete Full-Stack College Management System
echo ===================================================

echo Starting MongoDB...
start "CMS MongoDB" "%~dp0.tools\mongodb-win32-x86_64-windows-5.0.28\bin\mongod.exe" --dbpath "%~dp0.data\db" --port 27017

timeout /t 3 /nobreak >nul

echo Starting Spring Boot Backend...
start "CMS Spring Boot" "%~dp0run-backend.bat"

timeout /t 5 /nobreak >nul

echo Starting React Frontend...
start "CMS React Frontend" "%~dp0run-frontend.bat"

echo ===================================================
echo Applications launched!
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:8080
echo ===================================================
pause
