@echo off
title NoteFlow 启动中...
echo ================================
echo        NoteFlow 一键启动
echo ================================

:: 进入项目目录
cd /d "%~dp0"

:: 检查 node_modules 是否存在，不存在则安装依赖
if not exist "node_modules" (
    echo [INFO] 首次启动，正在安装依赖...
    call npm install
)

:: 启动前后端开发服务器
echo [INFO] 正在启动前端和后端服务...
echo [INFO] 启动完成后请访问: http://localhost:5173
echo.
call npm run dev

:: 保持窗口不自动关闭（防止报错闪退）
pause
