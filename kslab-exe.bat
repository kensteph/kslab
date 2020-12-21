@echo off
SETLOCAL EnableExtensions
set EXE=UwAmp.exe
FOR /F %%x IN ('tasklist /NH /FI "IMAGENAME eq %EXE%"') DO IF %%x == %EXE% goto FOUND
echo Launch %EXE%
START /MIN .\db_server\UwAmp.exe
echo Launched!
goto FIN
:FOUND
echo DATABASE IS READY (%EXE% is already running)
:FIN
cd ".\"
START /MIN cmd /C "node app.js"
START /MIN cmd /C "node app.js"
TIMEOUT /T 20
START .\KSlab-shortcut.html
goto :EOF
:minimized