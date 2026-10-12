@echo off
title College Management System - Backend
set JAVA_HOME=%~dp0.tools\jdk-17.0.12+7
set PATH=%JAVA_HOME%\bin;%~dp0.tools\apache-maven-3.9.6\bin;%PATH%
cd /d "%~dp0backend"
echo ===================================================
echo Starting Spring Boot Backend (Port 8080)
echo ===================================================
call mvn spring-boot:run
pause
