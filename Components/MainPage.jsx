import { useState, useEffect } from "react";

import { FcBusinessman } from "react-icons/fc";
import { FcSettings } from "react-icons/fc";
import { FcDepartment } from "react-icons/fc";
import UzakBaglanti from "./UzakBaglanti";

import Button from "@mui/material/Button";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import IconButton from "@mui/material/IconButton";

export default function Mainpage({ toggleSidebar }) {
  const [secili, setSecili] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const seciliClick = (a) => {
    setSecili(a);
  };

  const toggleAc = () => {
    setIsHovered(true);
  };

  const toggleKapat = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsScrolled(scrollTop > 100); // Sayfa yukarıda 100 pikselden fazla kaydırıldığında göster
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Sayfayı yukarı doğru pürüzsüz bir şekilde kaydır
  };

  return (
    <div className="w-full flex">
      <div
        className={`
      ${
        isHovered
          ? "w-60 bg-blue-800 duration-100"
          : "w-16 bg-blue-800 duration-150"
      }
      flex-row rounded-sm h-screen fixed
    `}
        onMouseEnter={toggleAc}
        onMouseLeave={toggleKapat}
      >
        <ul className="flex flex-col gap-2 p-2">
          <li
            className="flex items-center gap-2 p-2 cursor-pointer hover:bg-sky-400 rounded-xl"
            onClick={() => {
              seciliClick("UzakBaglanti");
            }}
          >
            <FcDepartment size={isHovered ? 25 : 50} />
            <span className={`${isHovered ? "" : "hidden"} font-semibold`}>
              Uzak Bağlantılar
            </span>
          </li>
          <li
            className="flex items-center gap-2 p-2 cursor-pointer hover:bg-sky-400 rounded-xl"
            onClick={() => {
              seciliClick("bakimlar");
            }}
          >
            <FcSettings size={isHovered ? 25 : 50} />
            <span className={`${isHovered ? "" : "hidden"} font-semibold`}>
              Bakımlar
            </span>
          </li>
          <li className="flex items-center gap-2 p-2 cursor-pointer hover:bg-sky-400 rounded-xl">
            <FcBusinessman size={isHovered ? 25 : 50} />
            <span className={`${isHovered ? "" : "hidden"} font-semibold`}>
              Sözleşmeler
            </span>
          </li>
        </ul>
      </div>
      <div className="flex-grow">
        {secili === "UzakBaglanti" && (
          <div className={`${isHovered ? "ml-60" : "ml-16"} overflow-y-auto`}>
            <UzakBaglanti />
          </div>
        )}
      </div>
      {isScrolled && (
        <div className="fixed bottom-10 right-10">
          <IconButton
            color="success"
            size="large"
            sx={{
              "&:hover": {
                backgroundColor: "#778899",
              },
              backgroundColor: "#bfbfbf",
            }}
            onClick={scrollToTop}
          >
            <ArrowUpwardIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
}
