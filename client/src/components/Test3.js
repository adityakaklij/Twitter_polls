import React, { useState } from 'react'

// import { WithContext as ReactTags } from 'react-tag-input';
import { TagsInput } from "react-tag-input-component";



import '../CSS/Home.css'

function Test3() {
  const [tags,setTags] = useState([])

  const [selected, setSelected] = useState([]);


  const KeyCodes = {
    comma: 188,
    enter: 13,
    space: 32,
  };
  
  const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space];
  
   
  const handleDelete = i => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = tag => {
    setTags([...tags, tag]);
  };

  const handleTagClick = index => {
    console.log('The tag at index ' + index + ' was clicked');
  };

  const getInput = (e) =>{
    console.log(e.target.value)
  }

  const handleChange = (e) =>{
    console.log(e.target.value)
  }

  function printArray() {
    console.log(selected)
    console.log((selected.join(" OR ")))
  }
  return (
    <div>
       <h2>Test 3</h2>

 
    
    <br /><br />

    <TagsInput classNames={"TagsInput"}
        value={selected}
        onChange={setSelected}
        name="fruits"
        separators={[" ", "TAB", ","]}
        placeHolder="Enter Keywords"
      />

      <button onClick={printArray}>printArray</button>

    </div>
  )
}

export default Test3