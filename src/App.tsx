import './App.css'

function App() {
  return (
    <div className="App">
      <h1>Campo minato</h1>
      <Field fieldSize={20} tileSize={25} />
    </div>
  )
}

function Field(props: { fieldSize: number, tileSize: number }) {
  const field = [];
  for (let y = 0; y < props.fieldSize; y++) {
    const row = [];
    for (let x = 0; x < props.fieldSize; x++) {
      const isEven = (x + y) % 2 == 0;
      row.push(<Tile isEven={isEven} key={x} />);
    }
    field.push(row);
  }

  return (
    <div className="field"
      style={{ display: 'grid', gridTemplateColumns: `repeat(${props.fieldSize}, ${props.tileSize}px)`, gridTemplateRows: `repeat(${props.fieldSize}, ${props.tileSize}px)` }}>
      {
        field
      }
    </div>
  )
}

function Tile(props: {isEven: boolean}) {
  return (
    <div className={`tile ${props.isEven ? 'even' : 'odd'}`}>

    </div>
  )
}

export default App
