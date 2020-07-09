if not "%minimized%"=="" goto :minimized
set minimized=true
@echo off

cd "D:\WEB\ks_lab"

start /min cmd /C "nodemon app.js"
goto :EOF
:minimized