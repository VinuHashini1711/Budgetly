@echo off
echo Starting Ollama Service...
start "Ollama" ollama serve
echo Ollama is now running in the background!
timeout /t 3
