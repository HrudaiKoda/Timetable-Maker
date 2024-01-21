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

  const [val, setVal] = useState(initialVal);
  const handleChange = (event,param1,param2) => {
    const { name, checked} = event.target;
    var changeValue = 0;
    if(checked)
    {
      changeValue = 1;
      handleElementChange(name,param1);
    }
    else
    {

      handleElementChange('',param1);
    }
    books.forEach(item => {
      if(item.slot === param1 && item._id !== param2)
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
    const handleElementChange = (value, slot) => {
      var indices = Index[slot];
      const newVal = [...val];
      for (let i = 0; i < indices.length; i++) {
        newVal[indices[i][0]][indices[i][1]] = value;
      }
      // Set the updated array as the new state
      setVal(newVal);
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

    <div className="split leftControl">
      <h1>Timetable</h1>
      <div>
      <label htmlFor="stream">Choose a stream : </label>

<select name="stream" id="stream">
<option value="cse">CSE</option>
<option value="ee">EE</option>
<option value="mech">Mechanical</option>
</select>
      </div>

    
      <form>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      </form>
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
      <label htmlFor={book.code}> {book.code} : Slot {book.slot} </label><br />
    </div>
  ))}


</div>
        
    </div>
    <div className="split right">
      <h1>Timetable</h1>

      <div>
      <table className="custom-table">
        <tbody>
          {val.map((row, rowIndex) => (
            <tr className='custom-row' key={rowIndex}>
              {row.map((value, colIndex) => (
                <td className="custom-cell" key={colIndex}>
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
