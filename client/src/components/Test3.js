import React, { useState } from 'react'
import { Dna } from  'react-loader-spinner'


function Test3() {
    const[isTrue, setIsTrue] = useState(false)

    function change() {
        setIsTrue(!isTrue)
    }

    if(isTrue){
        return(
            <div>
       <Dna
        visible={true}
        height="80"
        width="80"
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
    />
    </div>
        )
    }


  return (
    <div>
       <h2>Nothing</h2>
       <button onClick={change}>Change</button>
    </div>
  )
}

export default Test3