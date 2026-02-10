
@echo off
cd /d "%~dp0..\backend"
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
echo Installing dependencies...
pip install -r requirements.txt
echo Starting Flask Server...
python app.py
