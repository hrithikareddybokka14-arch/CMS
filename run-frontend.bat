@echo off
title College Management System - Frontend
cd /d "%~dp0frontend"
echo ===================================================
echo Starting React Vite Frontend (Port 5173)
echo ===================================================
call npm.cmd run dev
pause
