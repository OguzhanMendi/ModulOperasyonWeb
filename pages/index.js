import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Headers from "@/Components/Headers.jsx";
import Mainpage from "@/Components/MainPage";
import { Divider } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Cookie from "js-cookie";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    let userToken = Cookie.get("token");
    if (!userToken) {
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } else {
      setLoading(false);
    }
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      {loading ? (
        <div className="h-screen flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="box-content	 ">
          <div className="sticky top-0 z-50 bg-white ">
            <Headers toggleSidebar={toggleSidebar} user={user} />
          </div>
          <Divider />
          <Mainpage toggleSidebar={isSidebarOpen} />
        </div>
      )}
    </div>
  );
}
