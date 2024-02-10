import { useState, useEffect } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Image from "next/image";
import arkaPlan from "@/public/bbs.jpg";
import Logo from "@/public/logo.png";
import axios from "axios";
import { useDispatch } from "react-redux";
import Cookie from "js-cookie";
import CircularProgress from "@mui/material/CircularProgress";

export default function index() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState([
    {
      ad: "",
      sifre: "",
    },
  ]);
  let [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    let token = Cookie.get("token");
    if (token) {
      window.location.href = "/";
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  });
  const LoginService = async () => {
    debugger;

    try {
      if (!form.ad || !form.sifre) {
        setErrorMessage("Kullanıcı adı ve şifre alanları boş bırakılamaz.");
        return;
      }
      const reqBody = JSON.stringify({
        ad: form.ad,
        sifre: form.sifre,
      });

      const response = await axios.post(
        "https://localhost:7031/Login/login",
        reqBody,
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const { ad } = response.data;
        dispatch({
          type: "LOGIN",
          payload: {
            ad,
          },
        });
        Cookie.set("token", response.data.token, {
          expires: 30,
        });
        window.location.href = "/";
      }
    } catch (error) {
      if (error.response) {
        // Sunucudan hata yanıtı alındıysa
        errorMessage = error.response.data.title;
      } else {
        // Diğer hata durumları
        errorMessage = error.message;
      }
      setErrorMessage(errorMessage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Enter tuşunun varsayılan davranışını engelle
      LoginService();
    }
  };
  return (
    <>
      {loading === true ? (
        <div className="flex justify-center items-center h-screen">
          <CircularProgress />
        </div>
      ) : (
        <div
          style={{
            backgroundImage: `url(${arkaPlan.src})`,
            backgroundSize: "cover", // Resmi ekrana tamamen sığacak şekilde kapla
            backgroundPosition: "center", // Resmin ortalanması
            position: "relative",
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
          }}
          className="h-screen flex justify-center items-center "
        >
          <div className="w-1/3 p-5  items-center bg-gray-200 rounded-lg">
            <div className="flex flex-col justify-center items-center">
              <Image className="flex justify-center" src={Logo} width={200} />
              <h1 className=" font-semibold text-gray-900">RMOS & MODÜL</h1>
              {errorMessage && (
                <span className="font-bold text-center  text-red-600">
                  Hata Oluştu: {errorMessage}
                </span>
              )}
            </div>

            <div
              className="flex flex-col justify-center gap-5 mt-10 "
              onKeyPress={(e) => handleKeyPress(e)}
              tabIndex={0}
            >
              <TextField
                id="outlined-basic"
                label="Kullanıcı Adı"
                variant="outlined"
                value={form.ad}
                onChange={(event) => {
                  setForm({ ...form, ad: event.target.value });
                }}
              />
              <TextField
                id="outlined-basic"
                label="Şifre"
                variant="outlined"
                type="password"
                value={form.sifre}
                onChange={(event) => {
                  setForm({ ...form, sifre: event.target.value });
                }}
              />

              <div className="flex justify-center">
                <Button
                  variant="contained"
                  className="bg-gray-800 py-3 text-lg "
                  sx={{
                    width: "30%",
                    "&:hover": {
                      backgroundColor: "#2A3442",
                    },
                  }}
                  onClick={() => LoginService()}
                >
                  Giriş Yap
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
