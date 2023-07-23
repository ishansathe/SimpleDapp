

//import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import { ethers } from 'ethers';



import Web3 from 'web3'
import Lock from './contractABI.json';
//A thing to note is that it doesn't matter what name you give to what you are importing
//Just consider it as an object that you are using to implement whatever is inside the file
/*We can also see this happening in the index.js app
We have forsaken the App function long ago
We even export default as the Hello Message
But, in index.js file what is imported is 'App' from App.js
and <App /> is what is being rendered!

One mystery is how even now, after we uncomment the App function and try to display just it, the HelloMessage is displayed
Even after we set export default to App
*/

const contractAddress = "0x824F8Ca8A5D3014072d7C1c49fcD40AE50CF6F3d";

// 0x0aE028270472c213410f0c7B518c4c0e5B29A122
//0x4f9F7DFF13eB9583E1B4EF7b64854534756D24C0

/*
This address is what we received after running
npx hardhat run scripts/deploy.js --network goerli in the SimpleDapp directory
this is the address where our contract is deployed 

3 main factors to connecting contract on testnet to the Front End
  1. Contract Address
  2. Contract ABI
  3. Provider (Service Node, Infura, QuickNode, etc)
*/


class HelloMessage extends Component {
  
  constructor() {
    super();
    this.state = {
      isActive: false,
      name: "Ishan",
      account: '',
      unLockTime: '-',
    };

  }
  
  componentWillMount() {
    this.loadWeb3();

    this.loadBlockchainData();
  }
  
  async loadBlockchainData() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const lock = new ethers.Contract(contractAddress, Lock.abi , provider);
    const _owner = await lock.owner();
    let ultime = await lock.unlockTime();
    console.log(ultime);
    /*
    BigNumber {_hex: '0x6599469a', _isBigNumber: true}_hex: "0x6599469a"_isBigNumber: true[[Prototype]]: Object
    This is what we receive from above called method. So we have to convert it to the integer form
    */
    var time = parseInt(ultime);
    //This gives our proper unlockTime that we have set when we deployed the contract 
    //(Remember the 'npx hardhat run scripts/deploy.js --network goerli'?)
    console.log(_owner);
    console.log(time);
    this.setState({unLockTime: time})
  }

  async loadWeb3() {

    var web3 = new Web3( Web3.givenProvider || "https://wispy-maximum-seed.ethereum-goerli.discover.quiknode.pro/7436a2e01a18ee4cd9cf1c7c6da68284cd96c163/" )
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0]})
  }

  flipStates(){

    this.setState(({ isActive }) => ({isActive: !isActive}));
  }


  
  displayLockTime(){
    const cTime = Math.floor(Date.now()/1000);

    //Here we have to divide by 1000 cuz in Javascript it's considering Nano seconds as well
    //Also, math.floor so as to remove the decimal points and consider the previous tick (ie from 000)
    const timeLeft = this.state.unLockTime - cTime;
    const days = Math.floor(timeLeft / 60 / 60 / 24);
    const hours = Math.floor(timeLeft / 60 / 60 % 24);
    const minutes = Math.floor(timeLeft /60 % 60 );
    const seconds = Math.floor(timeLeft % 60);
    
    return (
      <label>Days: {days} <br></br> Hours: {hours} <br></br> Minutes: {minutes} <br></br> Seconds: {seconds}</label>
    )
  }


  render() {

    //const hook = this.hook();
    //const activity = this.showActivness();
    const timeLeft = this.displayLockTime();

    //const toggleOne = () => setOne(one => !one)
    //Conclusion: Maybe useState cannot be used inside the classes
    //and functions cannot be made inside classes
    //We will have to find  a different way
    return (
      <div>
        <div className= "Hello "><h1>Hello World {this.state.name}</h1></div>
        <div className = "App-header">
        
          <h3>Click button below to refresh time left</h3>
          <button type= "button"
          onClick = {() => this.flipStates()} 
          >Click Me</button>
          {/* If we don't enter ()=> then we get an error saying "cannot update during existing state transition.."
              when we don't use the above binding notation, we call the changeActivity methond inside the render method
              We want this call to be binded and done from outside. Such that we don't keep rendering it over and over */ }
                     
          <div>{this.state.one}</div>
          <div>{this.state.account}</div>
          <h2><pre>Locked Till (Unix Time):       {this.state.unLockTime}</pre></h2>
          <pre>Time Left till you can withdraw funds: </pre>
          <h3>{timeLeft}</h3>

        </div>
        

      </div>

    );
  }
}
export default HelloMessage;
