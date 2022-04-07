import logo from './logo.svg';
import './App.css';
import Version from './components/Version';
import Balance from './components/Balance';
import CreateAccount from './components/CreateAccount';
import GetLatestBlock from './components/GetLatestBlock';
import AddAccountFromKeyStore from './components/AddAccountFromKeyStore';
import Transfer from './components/Transfer';


function App() {
  return (
    <div className="App">
      <Version />
      <Balance />
      <CreateAccount />
      <GetLatestBlock />
      <AddAccountFromKeyStore />
      <Transfer />
    </div>
  );
}

export default App;
