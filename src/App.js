import "./App.css";
import { useEffect, useState } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "./firebase/firebaseConfig";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginBtn, setLoginBtn] = useState("Login with Google");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (result) => {
      if (result) {
        const { displayName, email } = result;
        setUserData({ displayName, email });
        setIsLoggedIn(true);
        setLoginBtn("Logout");
      } else {
        setIsLoggedIn(false);
        setLoginBtn("Login with Google");
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        // const credential = provider.credentialFromResult(result);
        // const token = credential.accessToken;

        const { displayName, email } = result.user;
        setUserData({ displayName, email });
        setIsLoggedIn(true);
        setLoginBtn("Logout");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const logoutWithGoogle = () => {
    signOut(auth)
      .then(() => {
        setUserData({});
        setIsLoggedIn(false);
        setLoginBtn("Login with Google");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="App">
      <div className="login-btn-container">
        <button
          onClick={isLoggedIn ? logoutWithGoogle : loginWithGoogle}
          className="login-with-google-btn"
        >
          {loginBtn}
        </button>

        <h1 className="display-name">{userData.displayName}</h1>
      </div>
    </div>
  );
}

export default App;
