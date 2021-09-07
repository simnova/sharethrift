import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import HelloWorld from "./components/helloWorld";
import { Header} from "./components/header";
import { Users } from "./components/users";


function App() {
  return (
    <div className="App">
      <Header isLoggedIn={false} />
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
          {/* ----------Add this below------------- */}
          <br />
         
        </p>
       
        <Users />
      </header>
    </div>
  );
}

export default App;
