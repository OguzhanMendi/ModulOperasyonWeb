import Link from "next/link";
import { useState } from "react";

import { FcBusinessman } from "react-icons/fc";
import { FcSettings } from "react-icons/fc";
import { FcDepartment } from "react-icons/fc";
import UzakBaglanti from "./UzakBaglanti";

export default function Mainpage({ toggleSidebar }) {
  const [secili, setSecili] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const seciliClick = (a) => {
    setSecili(a);
  };

  const toggleAc = () => {
    setIsHovered(true);
  };

  const toggleKapat = () => {
    setIsHovered(false);
  };

  return (
    <div className="w-full flex fixed h-screen  ">
      <div
        className={`
       
        ${
          isHovered
            ? "w-60 bg-blue-800 duration-100  "
            : "w-16 bg-blue-800	sduration-150  "
        } flex-row  rounded-sm   `}
        onMouseEnter={toggleAc}
        onMouseLeave={toggleKapat}
      >
        <ul className="flex flex-col gap-2 p-2 ">
          <li
            className="flex items-center gap-2 p-2 cursor-pointer  hover:bg-sky-400 rounded-xl"
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

      <div className="w-full mt-1 overflow-y-auto  ">
        {/* overflow-y-auto */}
        {secili === "UzakBaglanti" && <UzakBaglanti />}
      </div>
    </div>
  );
}
