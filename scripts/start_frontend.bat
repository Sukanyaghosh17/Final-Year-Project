
@echo off
cd /d "%~dp0..\frontend"
echo Installing dependencies...
call npm install
echo Starting Frontend...
npm run dev
