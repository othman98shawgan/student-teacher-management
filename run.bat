@echo off
echo ===== Starting Setup =====

echo.
echo Restoring .NET backend...
cd backend
dotnet restore
IF %ERRORLEVEL% NEQ 0 (
  echo Failed to restore .NET dependencies.
  pause
  exit /b
)

echo Updating database...
dotnet ef database update
IF %ERRORLEVEL% NEQ 0 (
  echo Failed to update database.
  pause
  exit /b
)
cd ..

echo.
echo Installing frontend dependencies...
cd frontend
call npm install
IF %ERRORLEVEL% NEQ 0 (
  echo Failed to install frontend dependencies.
  pause
  exit /b
)
cd ..

echo.
echo ===== Launching Applications =====

start powershell -NoExit -Command "cd backend; dotnet run --urls 'https://localhost:7178;http://localhost:5105'"
start powershell -NoExit -Command "cd frontend; npm run dev"

echo Applications are starting in new terminals...
pause
