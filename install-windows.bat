@echo off
setlocal
chcp 65001 >nul
title Evidence ^& Air - Install

echo.
echo   ============================================
echo     Evidence ^& Air  -  installing
echo   ============================================
echo.

set "SRC=%~dp0"
if "%SRC:~-1%"=="\" set "SRC=%SRC:~0,-1%"
set "SKILLS=%USERPROFILE%\.claude\skills"
set "DEST=%SKILLS%\evidence-and-air"

rem --- sanity: are we actually next to SKILL.md? -------------------------
if not exist "%SRC%\SKILL.md" (
  echo   [X] SKILL.md was not found next to this file.
  echo.
  echo   This usually means the installer is still inside the ZIP.
  echo   Extract the ZIP to a real folder first, then run this again.
  echo.
  pause
  exit /b 1
)

rem --- has Claude ever been opened? -------------------------------------
if not exist "%USERPROFILE%\.claude" (
  echo   [!] The .claude folder does not exist yet.
  echo       That folder is created the first time Claude runs.
  echo.
  echo       Open Claude once, close it, then run this installer again.
  echo.
  pause
  exit /b 1
)

if not exist "%SKILLS%" mkdir "%SKILLS%"

echo   Copying to:
echo   %DEST%
echo.

robocopy "%SRC%" "%DEST%" /E /NFL /NDL /NJH /NJS /NP /XD docs /XF install-windows.bat install-mac.command .gitignore >nul
if errorlevel 8 (
  echo   [X] The copy failed. Is the folder open or in use somewhere?
  echo.
  pause
  exit /b 1
)

if not exist "%DEST%\SKILL.md" (
  echo   [X] Something went wrong - SKILL.md is not in place.
  echo.
  pause
  exit /b 1
)

echo   ============================================
echo     Done.
echo   ============================================
echo.
echo   One last step, and it matters:
echo   QUIT Claude completely and open it again.
echo   Minimising is not enough - skills load only at startup.
echo.
echo   Then just ask it to build you a presentation.
echo.
pause
