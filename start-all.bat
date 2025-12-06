@echo off
echo ========================================
echo   Starting BudgetWise Application
echo ========================================
echo.

echo [1/3] Starting Ollama Service...
start "Ollama" ollama serve
timeout /t 3

echo [2/3] Starting Backend (Spring Boot)...
cd backend
start "Backend" cmd /k "mvnw.cmd spring-boot:run"
cd ..
timeout /t 10

echo [3/3] Starting Frontend (React)...
cd frontend
start "Frontend" cmd /k "npm start"
cd ..

echo.
echo ========================================
echo   All services started!
echo   - Ollama: http://localhost:11434
echo   - Backend: http://localhost:8085
echo   - Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to exit this window...
pause > nul
