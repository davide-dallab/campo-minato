import { useState } from "react";
import "./App.css";
import bomb from "./assets/bomb.png";
import flag from "./assets/flag.png";

function App() {
  return (
    <div className="App">
      <h1>Campo minato</h1>
      <Field fieldSize={{width: 15, height: 10}} bombCount={40} />
    </div>
  );
}

type Position = {
  x: number;
  y: number;
};

type Tile = {
  isBomb: boolean;
  discovered: boolean;
  position: Position;
  flag: boolean;
  bombCount: number;
};

type GameState = "covered" | "playing" | "won" | "lost";

function Field(props: {
  fieldSize: {width: number, height: number};
  bombCount: number;
}) {
  const [gameState, setGameState] = useState<GameState>("covered");
  const [field, setField] = useState<Tile[][]>(createStartingField());

  function createStartingField() {
    const startingField = [];
    for (let y = 0; y < props.fieldSize.height; y++) {
      const row = [];
      for (let x = 0; x < props.fieldSize.width; x++) {
        const currentTile: Tile = {
          position: { x, y },
          discovered: false,
          isBomb: false,
          flag: false,
          bombCount: 0
        };
        row.push(currentTile);
      }
      startingField.push(row);
    }

    return startingField;
  }

  function handleLeftClick(tile: Tile) {
    if(tile.flag) return;

    if (gameState === "covered") {
      setGameState("playing");
      plantMines(tile.position);
      exposeEmptyTile(tile);
    } else {
      if (tile.isBomb) {
        setGameState("lost");
      }
      else{
        if (tile.bombCount === 0){
          exposeEmptyTile(tile);
        }

        if(checkWin()){
          setGameState("won");
        }
      }
    }

    tile.discovered = true;

    rerender();
  }

  function checkWin() {
    for (let y = 0; y < props.fieldSize.height; y++) {
      for (let x = 0; x < props.fieldSize.width; x++) {
        const tile = field[y][x];
        if(!tile.isBomb && !tile.discovered) return false;
      }
    }

    return true;
  }
  
  function exposeEmptyTile(tile: Tile, buffer: string[] = []) {
    const tilePos = tile.position;
    tile.discovered = true;
    tile.flag = false;
    buffer.push(JSON.stringify(tilePos));
    checkAndExpose(tilePos.x - 1, tilePos.y);
    checkAndExpose(tilePos.x, tilePos.y - 1);
    checkAndExpose(tilePos.x, tilePos.y + 1);
    checkAndExpose(tilePos.x + 1, tilePos.y);

    function checkAndExpose(x: number, y: number) {
      if(y < 0 || y >= field.length || x < 0 || x >= field[y].length)
        return;
      
      const tile = field[y][x];
      
      if (buffer.indexOf(JSON.stringify({ x, y })) === -1 && !tile.isBomb) {
        exposeEmptyTile(field[y][x], buffer);
      }
    }
  }

  function plantMines(exclude: Position) {
    for (let mine = 0; mine < props.bombCount; mine++) {
      while (true) {
        const position = randomPosition();

        const tile = field[position.y][position.x];
        if (
          !(Math.abs(position.x - exclude.x) <= 1 && Math.abs(position.y - exclude.y) <= 1) &&
          !tile.isBomb
        ) {
          tile.isBomb = true;
          break;
        }
      }
    }

    for (let y = 0; y < props.fieldSize.height; y++) {
      for (let x = 0; x < props.fieldSize.width; x++) {
        const tile = field[y][x];
        tile.bombCount = countBombsNear({x, y});
      }
    }
  }

  function countBombsNear(position: Position) {
    let bombCount = 0;

    if (checkBomb({ x: position.x - 1, y: position.y - 1}))
      bombCount++;

    if (checkBomb({ x: position.x - 1, y: position.y}))
      bombCount++;
    
    if (checkBomb({ x: position.x - 1, y: position.y + 1 }))
      bombCount++;
    
    if (checkBomb({ x: position.x, y: position.y - 1 }))
      bombCount++;
    
    if (checkBomb({ x: position.x, y: position.y + 1 }))
      bombCount++;
    
    if (checkBomb({ x: position.x + 1, y: position.y - 1 }))
      bombCount++;
    
    if (checkBomb({ x: position.x + 1, y: position.y}))
      bombCount++;
    
    if (checkBomb({ x: position.x + 1, y: position.y + 1 }))
      bombCount++;

    return bombCount;
  }

  function checkBomb(position: Position) {
    if (
      position.y < 0 ||
      position.y >= field.length ||
      position.x < 0 ||
      position.x >= field[position.y].length
    )
      return false;
    
    return field[position.y][position.x].isBomb;
  }

  function randomPosition(): Position {
    return { x: randomCoordinate(props.fieldSize.width), y: randomCoordinate(props.fieldSize.height) };
  }

  function randomCoordinate(maxValue: number) {
    return Math.floor(Math.random() * maxValue);
  }

  function handleRightClick(tile: Tile){
    if(tile.discovered) return;
    
    tile.flag = !tile.flag;

    rerender();
  }

  function rerender(){
    setField((oldField) => [...oldField]);
  }

  return (
    <>
      <div
        className="field"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${props.fieldSize.width}, 1fr)`,
          gridTemplateRows: `repeat(${props.fieldSize.height}, 1fr)`
        }}
      >
        {field.map((row) =>
          row.map((tile) => (
            <Tile
              tile={tile}
              onRightClick={handleRightClick}
              onLeftClick={handleLeftClick}
              key={tile.position.y * props.fieldSize.width + tile.position.x}
            />
          ))
        )}
      </div>
      {gameState === "lost" && <h1>LOST :(</h1>}
      {gameState === "won" && <h1>WON :D</h1>}
    </>
  );
}

type ClickCallBack = (tile: Tile) => void;

function Tile(props: { tile: Tile; onRightClick: ClickCallBack; onLeftClick: ClickCallBack }) {
  const { tile, onRightClick, onLeftClick } = props;
  const display = getCurrentDisplay();

  function getCurrentDisplay() {
    if (tile.discovered && tile.isBomb) return "💣";
    if (tile.flag) return "🚩";
    if (!tile.discovered) return null;
    return <span>{tile.bombCount || ''}</span>;
  }
  
  return (
    <div
      onClick={() => onLeftClick(tile)}
      onContextMenu={evt => {
        evt.preventDefault();
        onRightClick(tile);
      }}
      className={`tile ${
        (tile.position.x + tile.position.y) % 2 === 0 ? "even" : "odd"
      } ${tile.discovered && "discovered"}`}
    >
      {display}
    </div>
  );
}

export default App;
