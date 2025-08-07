import { UserCard } from "../components/UserCard";
import { cleanUser } from "../libs/CleanUser";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
export default function RandomUserPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [genAmount, setGenAmount] = useState(1);
  const [isNotZero, setNotZero] = useState(true);
  const [isFristlLoad, setIsFirstLoad] = useState(true);

  const generateBtnOnClick = async () => {
    setIsLoading(true);
    
    if(genAmount == 0){
      setNotZero(false);
      return;
    }else{
      setNotZero(true);
    }

    const resp = await axios.get(
      `https://randomuser.me/api/?results=${genAmount}`
    );
    setIsLoading(false);
    const users = resp.data.results;
    const cleanUsers = users.map((user: any) => cleanUser(user));
    setUsers(cleanUsers);
  };

  useEffect(() => {
    if(isFristlLoad){
      setIsFirstLoad(false);
      return;
    }
    const strNumber = JSON.stringify(genAmount);
    localStorage.setItem("Number", strNumber);
  }, [genAmount]);

  useEffect(() => {
    const strNumber_2 = localStorage.getItem("Number");
    if(strNumber_2 === null){
      return;
    }
    const loadedNumber = JSON.parse(strNumber_2);
    setGenAmount(loadedNumber);
  },[])

  return (
    <div style={{ maxWidth: "700px" }} className="mx-auto">
      <p className="display-4 text-center fst-italic m-4">Users Generator</p>
      <div className="d-flex justify-content-center align-items-center fs-5 gap-2">
        Number of User(s)
        <input
          className="form-control text-center"
          style={{ maxWidth: "100px" }}
          type="number"
          onChange={(event: any) => setGenAmount(event.target.value)}
          value={genAmount}
        />
        <button className="btn btn-dark" onClick={generateBtnOnClick}>
          Generate
        </button>
      </div>
      {isLoading && isNotZero &&(
        <p className="display-6 text-center fst-italic my-4">Loading ...</p>
      )}
      {users && !isLoading && users.map((user) => 
        <UserCard
          name={user.name}
          email={user.email}
          imgUrl={user.imgUrl}
          address={user.address}
        />
      )}
    </div>
  );
}