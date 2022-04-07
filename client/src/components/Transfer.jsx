import React, { useState } from 'react';
import axios from 'axios';
const Transfer = () => {
    const [beforeBalance, setBeforBalance] = useState("");
    const [afterBalance, setAfterBalance] = useState("");
    const [amount, setAmount] = useState(1);
    const [unit, setUnit] = useState("KLAY");
    const [recipient, setRecipient] = useState("0xce48d66545c9d40498fa7ea569605a2c79adc8bd");
    const [address, setAddress] = useState("0x452451a06c0f4bb06b71da859a49980bfdcaf718");
    const [blockHash, setBlockHash] = useState("");
    const onClickHandler = async () => {
        const beforeB = await axios.get(`getBalance/?address=${address}`);
        setBeforBalance(beforeB?.data?.balance);
        const result2 = await axios.post(`transfer`, {
            amount,
            unit,
            recipient,
            address
        });
        if (!result2.hasOwnProperty("error")) {
            setBlockHash(result2?.data?.blockHash);
        }
        else {
            setBlockHash("실패")
        }
        const afterB = await axios.get(`getBalance/?address=${address}`);
        setAfterBalance(afterB?.data?.balance);
    }

    return <div style={{
        margin: "30px", padding: "30px", border: '1px solid black', borderRadius: "30px"
    }}>
        <h3>Transfer</h3>
        <div>
            {`amount : `}
            <input onChange={e => setAmount(e.target.value)} value={amount} />
        </div>
        <div>
            {`unit : `}
            <input onChange={e => setUnit(e.target.value)} value={unit} />
        </div>
        <div>
            {`recipient : `}
            <input onChange={e => setRecipient(e.target.value)} value={recipient} />
        </div>
        <div>
            {`my Address : `}
            <input onChange={e => setAddress(e.target.value)} value={address} />
        </div>
        <div>{`beforeBalance : ${beforeBalance}`}</div>
        <div>{`afterBalance : ${afterBalance}`}</div>
        <button onClick={onClickHandler}>전송</button>
        <div>생성된 블럭 해시값 : {blockHash}</div>
    </div>
}
export default Transfer;
