const express = require('express');
const router = express.Router();
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const Caver = require('caver-js')
const caver = new Caver('https://api.baobab.klaytn.net:8651/')
const fs = require('fs');

require('dotenv').config()


router.get('/getVersion', async function (req, res, next) {
  const version = await caver.rpc.klay.getClientVersion();
  res.json({ version });
});

router.get("/getLatestBlock", async (req, res) => {
  const block = await caver.rpc.klay.getBlockByNumber("latest");
  res.json({ block });
});

router.get('/createAccount', (req, res) => {
  const keyring = caver.wallet.keyring.generate()
  caver.wallet.add(keyring)
  res.json(caver.wallet.getKeyring(keyring.address));
})

router.post('/addAccountFromKeyStore', upload.single('keyStore'), async (req, res, next) => {
  try {
    const { file: { filename = "" } = {} } = req;
    const { body: { password = "" } = {} } = req;
    if (filename === "" || password === "") throw "인자부족";
    const keystore = fs.readFileSync(`uploads/${filename}`, 'utf8');
    console.log(keystore)
    console.log(req.file)
    const keyring = await caver.wallet.keyring.decrypt(keystore, password);
    await caver.wallet.add(keyring)
    return res.status(200).json(caver.wallet.getKeyring(keyring.address));
  }
  catch (error) {
    console.log("error", error, typeof error);
    return res.status(400).send({ error });
  }
});


router.get('/getBalance', async (req, res, next) => {
  const { address = "" } = req?.query;
  try {
    if (address === "") throw "인자 없음";
    const balance = await caver.klay.getBalance(address);
    return res.json({ balance });
  }
  catch (error) {
    res.json({ error });
  }
})


router.post('/transfer', async (req, res, next) => {
  const { amount = 0, unit = null, recipient = null, address = null } = req?.body;
  if (amount === 0 || unit === null || recipient === null || address === null) throw "인자부족";
  try {
    console.log(typeof amount, recipient, address)
    const transaction = await caver.transaction.valueTransfer.create({
      type: 'VALUE_TRANSFER',
      from: address,
      to: recipient,
      value: caver.utils.toPeb(1, unit),
      gas: 25000,
    })

    // transaction 서명
    const signed = await caver.wallet.sign(address, transaction)
    // transaction 전송
    const receipt = await caver.rpc.klay.sendRawTransaction(signed)
    console.log(receipt)
    res.json(receipt);
  }
  catch (error) {
    console.log("error: ", error)
    res.send({ error })
  }
})


// router.post('/feeDelegatedTransfer', async (req, res, next) => {
//   const { amount = 0, unit = null, recipient = null, address = null } = req?.body;
//   if (amount === 0 || unit === null || recipient === null || address === null) throw "인자부족";
//   try {
//     console.log(typeof amount, recipient, address)
//     const transaction = await caver.transaction.valueTransfer.create({
//       type: 'FEE_DELEGATED_VALUE_TRANSFER',
//       from: address,
//       to: recipient,
//       value: caver.utils.toPeb(1, unit),
//       gas: 25000,
//     })

//     // transaction 서명
//     const { rawTransaction: senderRawTransaction } = await caver.wallet.sign(address, transaction)
//     const rlpEncoded = await transaction.getRLPEncoding();
//     console.log(rlpEncoded)

//     // fee를 지불할 계정 추가
//     console.log("asddasf : ", process.env.feePrivateKey)
//     const feePayer = new caver.wallet.keyring.singleKeyring(process.env.feeAddress, process.env.feePrivateKey)
//     caver.wallet.add(feePayer);

//     // 수수료 위임 transaction 생성
//     const feePayerTransaction = {
//       type: 'FEE_DELEGATED_VALUE_TRANSFER',
//       feePayer: feePayer.address,
//       senderRawTransaction: senderRawTransaction,
//     }

//     // transaction 전송
//     const result = await caver.klay.sendTransaction(feePayerTransaction);
//     console.log(result)
//     return res.json({ result });
//     // .on('transactionHash', console.log)
//     // .on('receipt', async (receipt) => { console.log(receipt) })
//     // .on('error', console.log)


//     // // transaction 전송
//     // const receipt = await caver.rpc.klay.sendRawTransaction(signed)
//     // console.log(receipt)
//     // res.json(receipt);
//   }
//   catch (error) {
//     console.log("error: ", error)
//     res.send({ error })
//   }
// })


module.exports = router;
