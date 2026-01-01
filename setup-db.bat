@echo off
REM ETUSL Database Setup Script for Windows

echo ===================================
echo ETUSL Database Setup
echo ===================================
echo.

REM Create database and tables
echo Creating database and tables...
mysql -u root < backend\setup-staff.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================
    echo SUCCESS! Database setup complete
    echo ===================================
    echo.
    echo Test credentials:
    echo Staff ID: ETUSL0001
    echo Password: P@$$W0RD
    echo.
    echo Next steps:
    echo 1. Start backend: npm start (from backend folder)
    echo 2. Start frontend: npm start (from root folder)
    echo 3. Login at: http://localhost:3000
    echo.
) else (
    echo.
    echo ERROR: Database setup failed
    echo Please check:
    echo 1. MySQL is running
    echo 2. Password is correct in .env file
    echo.
)

pause
