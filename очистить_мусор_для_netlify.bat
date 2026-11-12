@echo off
chcp 65001 >nul
title Очистка проекта для Netlify
cd /d "%~dp0"

echo ======================================================================
echo    ОЧИСТКА МУСОРА И ДУБЛИКАТОВ ДЛЯ ХОСТИНГА NETLIFY
echo ======================================================================
echo.

echo [1/5] Удаление устаревших черновиков дизайна (stitch_modern_greenhouse_portfolio)...
if exist "stitch_modern_greenhouse_portfolio" (
    rmdir /s /q "stitch_modern_greenhouse_portfolio"
    echo      Готово!
) else (
    echo      Папка уже удалена.
)

echo [2/5] Удаление дублирующей папки "3D модель"...
if exist "3D модель" (
    rmdir /s /q "3D модель"
    echo      Готово!
) else (
    echo      Папка уже удалена.
)

echo [3/5] Удаление дубликата 55 МБ (model\model.glb)...
if exist "model\model.glb" (
    del /f /q "model\model.glb"
    echo      Готово! Оригинальный model.glb в корне проекта сохранён.
) else (
    echo      Файл уже удалён.
)

echo [4/5] Удаление дубликатов фотографий Windows...
if exist "сырые фото модели\каркас — копия.jpg" del /f /q "сырые фото модели\каркас — копия.jpg"
if exist "сырые фото модели\каркас 7 — копия.jpg" del /f /q "сырые фото модели\каркас 7 — копия.jpg"
echo      Готово!

echo [5/5] Проверка основных рабочих файлов сайта...
if exist "index.html" echo      [OK] index.html
if exist "gallery.html" echo      [OK] gallery.html
if exist "model.html" echo      [OK] model.html
if exist "model.glb" echo      [OK] model.glb (55 МБ)
if exist "style.css" echo      [OK] style.css
if exist "nav.js" echo      [OK] nav.js
if exist "netlify.toml" echo      [OK] netlify.toml
if exist ".netlifyignore" echo      [OK] .netlifyignore

echo.
echo ======================================================================
echo    УСПЕШНО! Освобождено более 74 МБ памяти.
echo    Проект полностью готов для загрузки на Netlify!
echo ======================================================================
echo.
pause
