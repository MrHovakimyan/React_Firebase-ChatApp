import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot, QuerySnapshot } from "firebase/firestore";
import User from "../components/User";

const Home = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const usersRef = collection(db, "users");
    // create query object
    const q = query(usersRef, where("uid", "not-in", [auth.currentUser.uid]));
    // execute query
    const unSub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unSub();
  }, []);
  console.log(users);
  return (
    <div className="home_container">
      <div className="users_container">
        {users.map((user) => (
          <User key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
};
export default Home;
