import React, { useEffect, useState } from 'react';
import axios from "../../api/axios";

axios.defaults.withCredentials = true;
let firstRender=true

function WelcomePage() {
  const [user, setUser] = useState(null);

  const sendRequest = async () => {
    try {
      const res = await axios.get('/api/user', {
        withCredentials: true,
      });
      const data = res.data;
      return data;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const refreshToken = async () => {
    try {
      const res = await axios.get('/api/refresh', {
        withCredentials: true,
      });
      const data = res.data;
      setUser(data.user);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if(firstRender){
      firstRender=false
    }
    sendRequest().then((data) => {
      if (data && data.user) {
        setUser(data.user);
      }
    });
    let interval = setInterval(refreshToken, 1000*28);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {user && <h1>{user.name}</h1>}
      {!user && <p>Loading user...</p>}
    </div>
  );
}

export default WelcomePage;
