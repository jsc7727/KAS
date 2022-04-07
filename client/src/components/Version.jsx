import React, { useState } from 'react';
import axios from 'axios';
const GetVersion = () => {
    const [version, setVersion] = useState("");

    const onClickHandler = async () => {
        const result = await axios.get("getVersion")
        console.log(result);
        setVersion(result?.data?.version);
    }

    return <div style={{
        margin: "30px", padding: "30px", border: '1px solid black', borderRadius: "30px"
    }}>
        <h3>getVersion</h3>
        <div>{`version : ${version}`}</div>
        <button onClick={onClickHandler}>버전</button>
    </div>
}
export default GetVersion;
