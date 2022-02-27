import React from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import { Account } from "./components/layouts/account";
import { Admin } from "./components/layouts/admin";
import Main from './components/layouts/main';
import ApolloConnection from './components/core/apollo-connection';
import RequireMsal from './components/require-msal';

function App() {
  const accountPage = <>
    <RequireMsal identifier="account">
      <ApolloConnection AuthenticationIdentifier="account">
        <Account />
      </ApolloConnection>
    </RequireMsal>
  </>

  const adminPage = <>
    <RequireMsal identifier="admin">
      <ApolloConnection AuthenticationIdentifier="admin">
        <Admin />
      </ApolloConnection>
    </RequireMsal>
  </>

  const mainPage = <>
    <ApolloConnection>
      <Main/>
    </ApolloConnection>
  </>

  return (
    <>
      <div className='h-screen w-screen bg-gray-100 flex flex-col'>
      
      <nav className="container mx-auto flex items-center justify-between flex-wrap bg-teal-500 p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          Sharethrift
        </div>
      </nav>
      <section className='container bg-green-300 flex-1 mx-auto'>
        
      <Routes>
        <Route path="/login" />
        <Route path="/account/*" element={accountPage} />
        <Route path="/admin/*" element={adminPage} />
        <Route path="/" element={mainPage} />
      </Routes>
      </section>
      <footer className={'bg-white'}>
        <div className={'container mx-auto'}>
          <div className={'flex flex-col md:flex-row bg-sky-500/100'}>
            <div className={'flex-1 p-6'}>
              <ul className={'list-reset text-sm'}>
                <li className={'mb-2'}>
                  <a href="https://getterms.io/view/8buiD/privacy/en-us" target="_blank" className={'text-gray-800 hover:text-blue-800'}>Privacy Policy</a>
                </li>
                <li className={'mb-2'}>
                  <a href="https://getterms.io/view/8buiD/tos/en-us" target="_blank" className={'text-gray-800 hover:text-blue-800'}>Terms of Service</a>
                </li>
                <li className={'mb-2'}>
                  <a href="https://getterms.io/view/8buiD/cookie/en-us" target="_blank" className={'text-gray-800 hover:text-blue-800'}>Cookie Policy</a>
                </li> 
                <li className={'mb-2'}>
                  <a href="https://getterms.io/view/8buiD/aup/en-us" target="_blank" className={'text-gray-800 hover:text-blue-800'}>Acceptable Use Policy</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </footer>
      </div>
    </>
  );
}

export default App;