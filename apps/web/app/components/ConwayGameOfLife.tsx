'use client';

import { useEffect, useRef } from 'react';

interface Cell {
  alive: boolean;
  age: number;
}

export default function ConwayGameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const gridRef = useRef<Cell[][]>([]);
  const cellSizeRef = useRef(8);
  const colsRef = useRef(0);
  const rowsRef = useRef(0);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Функция для рисования закругленного прямоугольника
    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      if (w < 2 * r) r = w / 2;
      if (h < 2 * r) r = h / 2;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    // Установка размеров canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cellSizeRef.current = Math.max(6, Math.min(10, Math.floor(window.innerWidth / 150)));
      colsRef.current = Math.floor(canvas.width / cellSizeRef.current);
      rowsRef.current = Math.floor(canvas.height / cellSizeRef.current);
      
      // Инициализация сетки с рандомными живыми клетками
      // Создаем несколько небольших кластеров для более интересных паттернов
      gridRef.current = Array(colsRef.current)
        .fill(null)
        .map(() =>
          Array(rowsRef.current)
            .fill(null)
            .map(() => ({
              alive: false,
              age: 0,
            }))
        );

      // Создаем несколько случайных кластеров
      const numClusters = Math.floor((colsRef.current * rowsRef.current) / 2000); // Примерно 1 кластер на 2000 клеток
      for (let i = 0; i < numClusters; i++) {
        const centerX = Math.floor(Math.random() * colsRef.current);
        const centerY = Math.floor(Math.random() * rowsRef.current);
        const clusterSize = 3 + Math.floor(Math.random() * 4); // Размер кластера 3-6 клеток
        
        for (let dx = -clusterSize; dx <= clusterSize; dx++) {
          for (let dy = -clusterSize; dy <= clusterSize; dy++) {
            if (dx * dx + dy * dy <= clusterSize * clusterSize) {
              const x = (centerX + dx + colsRef.current) % colsRef.current;
              const y = (centerY + dy + rowsRef.current) % rowsRef.current;
              if (Math.random() < 0.6) { // 60% вероятность в пределах кластера
                gridRef.current[x][y] = { alive: true, age: 0 };
              }
            }
          }
        }
      }

      // Добавляем немного случайных клеток для разнообразия
      for (let x = 0; x < colsRef.current; x++) {
        for (let y = 0; y < rowsRef.current; y++) {
          if (!gridRef.current[x][y].alive && Math.random() < 0.03) {
            gridRef.current[x][y] = { alive: true, age: 0 };
          }
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Функция для подсчета живых соседей
    const countNeighbors = (x: number, y: number): number => {
      let sum = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          const col = (x + i + colsRef.current) % colsRef.current;
          const row = (y + j + rowsRef.current) % rowsRef.current;
          if (gridRef.current[col]?.[row]?.alive) {
            sum++;
          }
        }
      }
      return sum;
    };

    // Функция для обновления сетки
    const updateGrid = () => {
      const newGrid: Cell[][] = Array(colsRef.current)
        .fill(null)
        .map(() =>
          Array(rowsRef.current)
            .fill(null)
            .map(() => ({ alive: false, age: 0 }))
        );

      for (let x = 0; x < colsRef.current; x++) {
        for (let y = 0; y < rowsRef.current; y++) {
          const neighbors = countNeighbors(x, y);
          const currentCell = gridRef.current[x][y];

          if (currentCell.alive) {
            if (neighbors === 2 || neighbors === 3) {
              newGrid[x][y] = { alive: true, age: currentCell.age + 1 };
            }
          } else {
            if (neighbors === 3) {
              newGrid[x][y] = { alive: true, age: 0 };
            }
          }
        }
      }

      gridRef.current = newGrid;
    };

    // Функция для отрисовки с красивыми эффектами
    const drawGrid = () => {
      // Очистка с легким fade эффектом для плавного следа
      ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cellSize = cellSizeRef.current;
      const grid = gridRef.current;

      for (let x = 0; x < colsRef.current; x++) {
        for (let y = 0; y < rowsRef.current; y++) {
          const cell = grid[x][y];
          if (cell.alive) {
            const px = x * cellSize;
            const py = y * cellSize;

            // Градиент в зависимости от возраста клетки
            // От голубого через синий к фиолетовому
            const ageFactor = Math.min(cell.age / 15, 1);
            const hue = 180 + ageFactor * 80; // От голубого (180) к фиолетовому (260)
            const saturation = 60 + ageFactor * 40;
            const lightness = 45 + ageFactor * 15;

            // Создание радиального градиента для эффекта свечения
            const gradient = ctx.createRadialGradient(
              px + cellSize / 2,
              py + cellSize / 2,
              0,
              px + cellSize / 2,
              py + cellSize / 2,
              cellSize * 0.8
            );

            // Яркое ядро
            gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness + 25}%, 0.95)`);
            // Средняя часть
            gradient.addColorStop(0.4, `hsla(${hue}, ${saturation}%, ${lightness + 10}%, 0.7)`);
            // Края
            gradient.addColorStop(0.8, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.4)`);
            gradient.addColorStop(1, `hsla(${hue}, ${saturation}%, ${lightness - 5}%, 0.1)`);

            ctx.fillStyle = gradient;
            
            // Рисуем с закругленными углами
            const radius = cellSize * 0.3;
            roundRect(px + 1, py + 1, cellSize - 2, cellSize - 2, radius);
            ctx.fill();

            // Свечение для старых клеток
            if (cell.age > 3) {
              ctx.shadowBlur = 12;
              ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness + 15}%, 0.6)`;
              roundRect(px + 1, py + 1, cellSize - 2, cellSize - 2, radius);
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      }
    };

    // Основной цикл игры
    let lastTime = 0;
    const fps = 10; // Скорость обновления (10 кадров в секунду)
    const interval = 1000 / fps;

    const gameLoop = (currentTime: number) => {
      if (!isPausedRef.current) {
        if (currentTime - lastTime >= interval) {
          updateGrid();
          lastTime = currentTime;
        }
        drawGrid();
      }
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    // Пауза при скрытии страницы для оптимизации
    const handleVisibilityChange = () => {
      isPausedRef.current = document.hidden;
      if (!document.hidden) {
        drawGrid(); // Перерисовываем при возврате
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 pointer-events-none"
      style={{
        background: 'transparent',
      }}
    />
  );
}
