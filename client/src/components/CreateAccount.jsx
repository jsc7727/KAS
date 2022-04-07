import React, { useState } from 'react';
import axios from 'axios';
const CreateAccount = () => {
    const [address, setAddress] = useState("");
    const [privateKey, setPrivateKey] = useState("");

    const onClickHandler = async () => {
        const result = await axios.get(`createAccount`);
        const { _address = "", _key: { _privateKey = "" } } = result?.data;
        setAddress(_address);
        setPrivateKey(_privateKey);
    }

    return <div style={{
        margin: "30px", padding: "30px", border: '1px solid black', borderRadius: "30px"
    }}>
        <h3>createAccount</h3>
        <div>{`address : ${address}`}</div>
        <div>{`privateKey : ${privateKey}`}</div>
        <button onClick={onClickHandler}>버전</button>
    </div>
}
export default CreateAccount;
