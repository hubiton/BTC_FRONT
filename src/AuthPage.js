import { Button, Input } from "antd";
import axios from "axios";
import { useNavigate } from "react-router";

export default function AuthPage() {
  const navigate = useNavigate();
  var login = "";
  var pass = "";

  const handleLogin = async () => {
    let res = "";
    await axios.get(`/api/v1/login/${login}/${pass}`).then((response) => {
      res = response.data;
    });
    console.log(res);
    if (res === true) {
      console.log("tete");
      navigate("/app");
    }
  };

  const handleRegister = async () => {
    let res = "";
    await axios.get(`/api/v1/register/${login}/${pass}`).then((response) => {
      res = response.data;
    });
    if (res === login) {
      navigate("/app");
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        width: "30vw",
        height: "50vh",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "gainsboro",
        borderRadius: "5%",
      }}
    >
      <Input placeholder="Login" onChange={(e) => (login = e.target.value)}></Input>
      <Input placeholder="Haslo" onChange={(e) => (pass = e.target.value)}></Input>
      <Button onClick={() => handleRegister()}>Zarejestruj</Button>
      <Button onClick={() => handleLogin()}>Zaloguj</Button>
    </div>
  );
}
