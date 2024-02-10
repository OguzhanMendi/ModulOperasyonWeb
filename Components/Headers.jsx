import { useState } from "react";
import Image from "next/image";
import Logo from "@/public/logo.png";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { deepOrange, blue } from "@mui/material/colors";

import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Cookie from "js-cookie";
export default function Headers({ toggleSidebar, user }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = ({ event }) => {
    setAnchorEl(null);
  };
  return (
    <div className="flex justify-between p-3 w-full items-center">
      <div onClick={toggleSidebar}>
        <Image className="cursor-pointer" src={Logo} width={80} />
      </div>

      <div className="flex gap-2 ">
        <div>
          <span className="text-sky-700 font-bold">MO</span>
          <span className="text-red-500 font-semibold">DÜL </span>
        </div>

        <span className="font-bold animate-bounce">Operasyon Portalı</span>
      </div>

      <Avatar
        className="cursor-pointer    hover:bg-black "
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{ bgcolor: blue[500] }}
        onClick={handleClick}
      >
        {user?.user?.ad[0]?.toUpperCase()}
      </Avatar>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>Ayarlar</MenuItem>
        <MenuItem
          onClick={() => {
            dispatch({
              type: "LOGOUT",
            });
            Cookie.remove("token");
            router.push("/login");
          }}
        >
          Çıkış yap
        </MenuItem>
      </Menu>
    </div>
  );
}
