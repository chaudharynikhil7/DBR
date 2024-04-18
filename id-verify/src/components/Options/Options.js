import React , { useState } from 'react'
import "../../cvr"; // import side effects. The license, engineResourcePath, so on.
import Normalizer from './../DDN/Normalizer';
import Barcode from './../DBR/Barcode'

function Options() {
    const [mode, setMode] = useState("normalize");
    return (
      
      <div className='App'>
        <div className='top-btns'>
          <button onClick={() => { setMode("normalize") }} style={{ backgroundColor: mode === "normalize" ? "rgb(255, 174, 55)" : "#fff" }}>Normalizer</button>
          <button onClick={() => { setMode("barcode") }} style={{ backgroundColor: mode === "barcode" ? "rgb(255, 174, 55)" : "#fff" }}>Barcode</button>
        </div>
        {mode === "normalize" ? <Normalizer /> : <Barcode />}
      </div>
    );
}
export default Options

