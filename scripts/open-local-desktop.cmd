@echo off
setlocal
rem Local source-workspace launcher. This is not the signed Windows release.
pushd "%~dp0.."
if errorlevel 1 exit /b 1
if not exist "%ProgramFiles%\nodejs\node.exe" goto missing
echo Starting NEXORA local services. Please wait...
"%ProgramFiles%\nodejs\node.exe" "scripts\desktop-launch.mjs"
if errorlevel 1 goto failed
if /i "%~1"=="--verify" goto done
"%ProgramFiles%\nodejs\node.exe" "scripts\open-local-browser.mjs"
if errorlevel 1 goto failed
:done
popd
exit /b 0
:missing
echo NEXORA local launcher configuration is missing. No data was changed.
goto failed
:failed
echo NEXORA could not open. Review the startup message above.
echo App logs: .local\desktop-server.log
if /i not "%~1"=="--verify" pause
popd
exit /b 1
