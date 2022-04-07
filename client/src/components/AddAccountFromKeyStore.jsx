import React, { useState } from 'react';
import axios from 'axios';
const AddAccountFromKeyStore = () => {
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [privateKey, setPrivateKey] = useState("");
    const [error, setError] = useState("");
    const onChangeFileHandler = async (e) => {
        e.preventDefault();
        if (e.target.files) {
            const uploadFile = e.target.files[0]
            const formData = new FormData()
            formData.append('keyStore', uploadFile)
            formData.append('password', password)
            try {
                const result = await axios.post('addAccountFromKeyStore', formData);
                const { _address = "", _key: { _privateKey = "" } } = result?.data;
                setAddress(_address);
                setPrivateKey(_privateKey);
                setError("none");
            }
            catch (error) {
                console.dir(error)
                setAddress("");
                setPrivateKey("");
                setError(error.message)
            }
        }
    }
    return <div style={{
        margin: "30px", padding: "30px", border: '1px solid black', borderRadius: "30px"
    }}>
        <h3>AddAccountFromKeyStore</h3>
        {/* <div>{`address : ${address}`}</div>
        <div>{`privateKey : ${privateKey}`}</div> */}
        <form>
            <label htmlFor="profile-upload" />
            <div>
                {`password : `}
                <input type="password" onChange={e => setPassword(e.target.value)} value={password} />
            </div>
            <input type="file" id="profile-upload" accept="application/json" onChange={onChangeFileHandler} />
        </form>
        <div>{`address : ${address}`}</div>
        <div>{`privateKey.slice(50) : ${privateKey.slice(50)}`}</div>
        <div>{`error : ${error}`}</div>
    </div>
}
export default AddAccountFromKeyStore;
