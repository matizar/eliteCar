@echo off
title Servidor Local EliteCar
cls
echo ========================================================
echo Iniciando Servidor Web Local para EliteCar...
echo Los contenidos JSON se cargaran dinamicamente.
echo ========================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
pause
