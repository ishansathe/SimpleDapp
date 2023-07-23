


import './App.css';
import React, { Component } from 'react';
import { ethers } from 'ethers';



import Web3 from 'web3'
import Lock from './contractABI.json';
/*
A thing to note is that it doesn't matter what name you give to what you are importing
Like how over here we have imported the file into the name 'Lock' which is quite similar to how we import libraries in Python!
Just consider it as an object that you are using to implement whatever is inside the file

---------------------

We can also see this happening in the index.js app
We have forsaken the App function long ago
We even export default as the Hello Message
But, in index.js file what is imported is 'App' from App.js
and <HelloMessage /> is what is being rendered!

*/
 
const contractAddress = "0x824F8Ca8A5D3014072d7C1c49fcD40AE50CF6F3d";

//Just some more addresses that I tested on, you need not have these, can remove.
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
    /*
    Here, we are simply setting the state values that will be used later on.
    Some of these will be shown as is, some will be altered, some will not be shown at all! (But be used for a greater purpose).
    These will be discovered ahead.
    */

  }
  
  componentWillMount() {
    this.loadWeb3();

    this.loadBlockchainData();
  }
  

  async loadWeb3() {

    var web3 = new Web3( Web3.givenProvider || "https://wispy-maximum-seed.ethereum-goerli.discover.quiknode.pro/7436a2e01a18ee4cd9cf1c7c6da68284cd96c163/" )
    
    /*
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0]})
    */
    //This part of code, for now isn't doing anything and is hence commented out.
  }


  async loadBlockchainData() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //Here, the provider that we set in the previous 'loadWeb3' function, i.e our Quicknode HTTPS address is being used.
    //For some reason, the accounts aren't being accessible, we will address that, at a later time.

    const lock = new ethers.Contract(contractAddress, Lock.abi , provider);
    //As said earlier, 3 main things to connect the Smart Contract to the front end!

    const _owner = await lock.owner();
    let ultime = await lock.unlockTime();
    //owner and unlockTime are variables of the smart contract.
    //But since by default the variables are stored as 'get' functions, we can call them directly.

    console.log(ultime);
    /*
    BigNumber_hex: "0x6697c3b8"_isBigNumber: true[[Prototype]]: Object
    This is what we receive from above called method. So we have to convert it to the integer form
    */

    var time = parseInt(ultime);
    //This gives our proper unlockTime that we have set when we deployed the contract 
    //(Remember the 'npx hardhat run scripts/deploy.js --network goerli'?)


    console.log(_owner);
    console.log(time);
    //console.logs are simply good practices in helping us debug.
    //They help us determine whether the values stored inside the variables are indeed the values that we want.

    this.setState({unLockTime: time})
    //Here, we have set the unlock time (as a state), which will be used further in the rendering part
  }


  flipStates(){

    this.setState(({ isActive }) => ({isActive: !isActive}));
  }
  /*
    The purpose of this function is simple.
    It causes the flipping of states.
    We won't be seeing the actual change of value on the front end web page.
    What we are doing here is exploiting the working of react. That is, whenever a button is clicked or a state is changed,
    React will refresh or re-render the whole page.
    Meaning the rest of the code that we have (that is countdown based) will be refreshed. Such that we get the current countdown
    whenever we click on the button to which this function is binded. (See render function).
  */

  
  displayLockTime(){

    const cTime = Math.floor(Date.now()/1000);
    //cTime is simply current Time.
    //Here we have to divide by 1000 cuz in Javascript it's considering Nano seconds as well
    //Also, math.floor so as to remove the decimal points and consider the previous tick (ie from 000)

    const timeLeft = this.state.unLockTime - cTime;
    const days = Math.floor(timeLeft / 60 / 60 / 24);
    const hours = Math.floor(timeLeft / 60 / 60 % 24);
    const minutes = Math.floor(timeLeft /60 % 60 );
    const seconds = Math.floor(timeLeft % 60);

    /*
    We did have to perform the calculation somewhere, so we chose it to be in a separate function outside of the render()
    Giving us clarity in organisation of our code. This function will then return an HTML code snippet which is then called inside
    the render() function.
    */
    
    return (
      <label>Days: {days} <br></br> Hours: {hours} <br></br> Minutes: {minutes} <br></br> Seconds: {seconds}</label>
    )
  }


  render() {

    const timeLeft = this.displayLockTime();
    /*
    This is the function that we just declared above. stored inside a constant
    Since we aren't using any interactive component in here like a button to display the lock time,
    we will be using a const inside the render function.
    this constant will be displayed as is on the page.
    Magic is when the page gets re-rendered using the state toggle!
    */

    //Note that in the render function, you can play with the HTML tags as much as you please. Personally, I just got bored
    //trying to arrange stuff in some order. Maybe this will also be a next project thing.

    return (
      <div>
        
        <div className = "App-header">
        <div className= "Hello"><h1>Hello World {this.state.name}</h1></div>
          <h3>Click button below to refresh time left</h3>
          <button type= "button"
          onClick = {() => this.flipStates()} 
          >Click Me</button>
          {/* If we don't enter ()=> then we get an error saying "cannot update during existing state transition.."
              meaning it renders over and over, which is not desired.  */ }

          <div className = "App-link">           
            <h2><pre>Locked Till (Unix Time):       {this.state.unLockTime}</pre></h2>
          </div>
          
          <h2>Time Left till you can withdraw funds:</h2>
          
          <div className = "App-link">
            <h3>{timeLeft}</h3>
          </div>
          
        </div>

      </div>

    );
  }
}
export default HelloMessage;
