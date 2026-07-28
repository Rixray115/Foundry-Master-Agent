#!/bin/bash
# Graphify convenience wrapper for pi-foundry
# Requires DEEPSEEK_API_KEY in environment (or any supported key)
# Usage: ./graphify.sh query "question" | ./graphify.sh path A B | ./graphify.sh explain Node
cd /c/Users/ricar/pi-foundry
exec "C:/Users/ricar/AppData/Local/Python/pythoncore-3.14-64/python.exe" -m graphify "$@"
