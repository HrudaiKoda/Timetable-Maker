// src/BookList.js
import React, { useState, useEffect } from 'react';
const BookList = () => {
  const [books, setBooks] = useState([]);
  const [checkedState, setCheckedState] = useState([]);
  const initialVal = [
    ['Days', '8:00-8:50', '9:00-9:50', '10:00-10:50', '11:00-11:50', '12:00-12:50', '14:00-15:15', '15:30-16:45', '17:00-17:50'],
    ['Mon', '', '', '', '', '', '', '', ''],
    ['Tue', '', '', '', '', '', '', '', ''],
    ['Wed', '', '', '', '', '', '', '', ''],
    ['Thu', '', '', '', '', '', '', '', ''],
    ['Fri', '', '', '', '', '', '', '', ''],
  ];

  const initialValSlots = [
    ['','', '', '', '', '', '', '', '' ],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', ''],
  ];

  const colors = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  ];

  const used1 = new Set();
  const Unused1 = [];
  var colorMapper1 = {};

   var Index = {};
  Index['A'] = [[1,1],[2,5],[4,4],[5,3]];
  Index['B'] = [[1,2],[2,1],[3,5],[5,4]];
  Index['C'] = [[1,3],[2,2],[3,1],[5,5]];
  Index['D'] = [[1,4],[2,3],[3,2],[4,5]];
  Index['E'] = [[2,4],[3,3],[4,1],[5,8]];
  Index['F'] = [[2,8],[3,4],[4,2],[5,1]];
  Index['G'] = [[1,5],[4,3],[5,2],[3,8]];
  Index['H'] = [[1,6],[2,7],[4,8]];
  Index['J'] = [[1,8],[3,6],[4,7]];
  
  Index['K'] = [[3,7],[5,6]];
  Index['L'] = [[3,6],[4,7]];
  Index['M'] = [[1,7],[2,6]];

  Index['P'] = [[1,6],[1,7]];
  Index['Q'] = [[2,6],[2,7]];
  Index['R'] = [[3,6],[3,7]];
  Index['S'] = [[4,6],[4,7]];
  Index['T'] = [[5,6],[5,7]];


  var colorTable={};
  colorTable[0] = "a";
  colorTable[1] = "b";
  colorTable[2] = "c";
  colorTable[3] = "d";
  colorTable[4] = "e";
  colorTable[5] = "f";
  colorTable[6] = "g";
  colorTable[7] = "h";
  colorTable[8] = "i";
  colorTable[9] = "j";
  colorTable[10] = "k";
  colorTable[11] = "l";

  var slotClash = [
    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0]
  ];
  var slotIndexMap = {};
  slotIndexMap["P"] = 0;
  slotIndexMap["Q"] = 1;
  slotIndexMap["R"] = 2;
  slotIndexMap["S"] = 3;
  slotIndexMap["T"] = 4;
  slotIndexMap["H"] = 5;
  slotIndexMap["M"] = 6;
  slotIndexMap["J"] = 7;
  slotIndexMap["K"] = 8;
  slotIndexMap["L"] = 9;

  const [val, setVal] = useState(initialVal);
  const [Slotval, SlotsetVal] = useState(initialValSlots);
  const [colorsVal, colorsSetVal] = useState(colors);
  var [colorCounter, SetcolorCounter] = useState(-1);

  var[used,SetUsed] = useState(used1);
  var[Unused,SetUnused] = useState(Unused1);
  var[colorMapper,SetcolorMapper] = useState(colorMapper1);
  const handleChange = (event,param1,param2) => {
    const { name, checked} = event.target;
    var changeValue = 0;
    if(checked)
    {
      changeValue = 1;
      handleElementChange(name,param1,param1,1);
    }
    else
    {

      handleElementChange('',param1,'',-1);
    }
    
    var clashSlots = [];
    if (param1[0] in slotIndexMap) 
    {
      const keysArray = Object.keys(slotIndexMap);
      for(var iter = 0; iter < 10; iter++)
      {
        if(slotClash[slotIndexMap[param1[0]]][iter] === 1)
        {
          clashSlots.push(keysArray[iter]);
        }
      }
    }
    
    books.forEach(item => {
      if((item.slot[0] === param1[0] || clashSlots.includes(item.slot[0]) ) && item._id !== param2)
      {item.disabled = changeValue;} // Change the 'name' property to uppercase
    });
    setCheckedState((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };
  const [file, setFile] = useState(null);
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Make a POST request to your upload endpoint
      const response = await fetch('https://mern-app-lf5e.onrender.com/entrys/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

    // Function to handle the change of an element in the stateArray
   const handleElementChange = (value, slot,slotVal,incr) => {
      var indices = Index[slot[0]];
      const newVal = [...val];
      const newSlotVal = [...Slotval]
      const newColors = [...colorsVal]
      var newColorCounter = -1;

      const usedArray = new Set(used)
      const UnusedArray = [...Unused]
      const colorMapperObj = {...colorMapper}
      const thiscolor = colorCounter;
      if(incr === 1)
      {
        if(UnusedArray.length === 0)
        {
          usedArray.add(thiscolor + incr);
          newColorCounter = thiscolor + 1;
          SetcolorCounter(newColorCounter);
          colorMapperObj[slot[0]] = newColorCounter;
        }
        else
        {
          newColorCounter = UnusedArray[0];
          colorMapperObj[slot[0]] = newColorCounter;
          usedArray.add(newColorCounter);
          UnusedArray.shift();
        }
        
      }
      else
      {
        UnusedArray.push(colorMapper[slot[0]]);
        usedArray.delete(colorMapper[slot[0]]);
      }
      console.log(usedArray);
      console.log(UnusedArray);
      console.log(newColorCounter,thiscolor);
      for (let i = 0; i < indices.length; i++) {
        newVal[indices[i][0]][indices[i][1]] = value;
        newSlotVal[indices[i][0]][indices[i][1]] = slotVal;
        newColors[indices[i][0]][indices[i][1]] = newColorCounter;

      }
      // Set the updated array as the new state
      setVal(newVal);
      SlotsetVal(newSlotVal);
      colorsSetVal(newColors);

      SetUsed(usedArray);
      SetUnused(UnusedArray);
      SetcolorMapper(colorMapperObj);
    };


  useEffect(() => {
    // Fetch data from the Node.js API
    fetch('https://mern-app-lf5e.onrender.com/entrys')
      .then(response => response.json())
      .then(data => {
        data = data.map(obj => ({ ...obj, disabled: 0 }));
        setBooks(data);
        console.log(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (


<div>

    <div className="split leftControl shadow p-3 mb-5 bg-white rounded">
      <h1>Timetable</h1>

      <div className='left'>
  {books.map(book => (
    <div key={book._id}>
      <input
        type="checkbox"
        checked={checkedState[book._id]}
        onChange={event => handleChange(event, book.slot,book._id)}
        disabled = {(book.disabled)? "disabled" : ""}
        id={book._id}
        name={book.code}
        value={book._id}
        
        
      />
      <label htmlFor={book.code}> { book.code} : Slot {book.slot} </label><br />
    </div>
  ))}


</div>
        
    </div>
    <div className="split right ">
      <br></br><br></br><br></br><br></br>
      <div>
      <table className="custom-table">
        <tbody>
          {val.map((row, rowIndex) => (
            <tr className='custom-row' key={rowIndex} >
              {row.map((value, colIndex) => (
                <td className={`custom-cell ${colorsVal[rowIndex][colIndex] !== -1 ? colorTable[colorsVal[rowIndex][colIndex]] : "dummy"}`}key={colIndex}>
                 {Slotval[rowIndex][colIndex]} {(rowIndex === 0 || colIndex === 0) ? <span></span> : <br/>}
                 {value}

                 
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
    </div>
  );
};

export default BookList;
