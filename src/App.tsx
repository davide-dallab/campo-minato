import './App.css'

function App() {
  return (
    <div className="App">
      <h1>Campo minato</h1>
      <Field size={20} />
    </div>
  )
}

function Field(props: { size: number }) {
  const field = [];
  for (let y = 0; y < props.size; y++) {
    const row = [];
    for (let x = 0; x < props.size; x++) {
      row.push(<Tile key={x} />);
    }
    field.push(<div className='row'>{row}</div>);
  }

  console.log(field); 

  return (
    <div className="field" style={{display: 'grid', gridTemplateColumns: `repeat(${props.size}, 25px)`, gridTemplateRows: `repeat(${props.size}, 25px)`}}>
      {
        field
      }
    </div>
  )
}

function Tile() {
  return (
    <div className="tile">

    </div>
  )
}

export default App
