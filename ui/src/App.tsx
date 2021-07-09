import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useMsal } from "./components/msal-react-lite";
import HelloWorld from "./components/helloWorld";
import { AuthenticationResult } from "@azure/msal-browser";
import { gql, useMutation } from "@apollo/client";
import moment from "moment";

const GET_SERVER_TIME = gql`
  mutation {
    getServerTime
  }
`;
/* hoping for sonarlint break
interface CreateAccountDetails {
  firstName: string | undefined,
  lastName: string | undefined,
  description: string | undefined
}
*/

function App() {
  const { login, logout, getAuthToken, getAuthResult, isLoggedIn } = useMsal();
  const [userName, setUsername] = React.useState<string>("");
  const [serverTime, setServerTime] = useState<string>("not set");
  const [expirationTime, setExpirationTime] = useState<string>("not set");
  const [getServertime, { loading: updateLanguageLoading }] = useMutation(
    GET_SERVER_TIME
  );
  const getServerTime = async () => {
    await getServertime()
      .then((data: any) => {
        console.log(data);

        if (data) {
          const result = JSON.parse(data?.data?.getServerTime);
          setServerTime(moment.utc(result.currentTime).local().toString());
          setExpirationTime(
            moment.utc(result.expirationTime*1000).local().toString()
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  React.useEffect(() => {
    (async () => {
      var authResult = await getAuthResult();
      console.log("AuthResult:", authResult);
      setUsername((authResult?.idTokenClaims as any)?.name ?? ("" as string));
    })();
  }, [isLoggedIn, getAuthResult]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <p>
          Edit <code>src/App.tsx</code> and save to reload.
          {/* ----------Add this below------------- */}
          <br />
          Login Status:{" "}
          {isLoggedIn ? <span>Logged In</span> : <span>Logged Out</span>} <br />
          {!userName ? (
            <></>
          ) : (
            <>
              Welcome {userName}!<br />
            </>
          )}
          <button onClick={async () => await login()}>LogIn</button>
          <button onClick={() => logout()}>LogOut</button>
          <button
            onClick={async () =>
              console.log("AuthToken:", await getAuthToken())
            }
          >
            Get Auth Token
          </button>
          <button
            onClick={async () =>
              console.log("AuthResult:", await getAuthResult())
            }
          >
            Get Auth Result
          </button>
          <button onClick={() => getServerTime()}>Click to get Server Time</button>
        </p>
        <HelloWorld />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>server time: {serverTime}</div>
        <div>token expireation time: {expirationTime}</div>
      </header>
    </div>
  );
}

export default App;
