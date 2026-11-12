@echo off
title 3D Server - Smart Greenhouse
cls
cd /d "%~dp0"
echo ==========================================================
echo Starting Smart Greenhouse 3D Model Server...
echo ==========================================================
powershell -NoProfile -ExecutionPolicy Bypass -Command "$dir = (Get-Item -LiteralPath '.').FullName; Set-Location -LiteralPath $dir; $script = [System.IO.File]::ReadAllText((Join-Path $dir 'server.ps1')); Invoke-Expression $script"
if errorlevel 1 (
    echo.
    echo ==========================================================
    echo PowerShell server stopped.
    echo ==========================================================
)
pause
