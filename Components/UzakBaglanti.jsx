import { useState, useEffect, Fragment } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { IoCreateOutline } from "react-icons/io5";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import Cookie from "js-cookie";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import Snackbar from "@mui/material/Snackbar";

import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";

export default function UzakBaglanti() {
  const [filtre, setFiltre] = useState("");
  const [data, setData] = useState([]);

  const [form, setForm] = useState([
    {
      sirketAd: "",
      baglantiAd: "",
      baglantiId: "",
      baglantiSifre: "",
      yetkiliAd: "",
      yetkiliTel: "",
    },
  ]);

  const [updateform, setUpdateForm] = useState([
    {
      sirketAd: "",
      baglantiAd: "",
      baglantiId: "",
      baglantiSifre: "",
      yetkiliAd: "",
      yetkiliTel: "",
    },
  ]);

  const [updateOpen, setUpdateOpen] = useState(false);

  const updateDialogOpen = () => {
    setUpdateOpen(true);
  };

  const updateDialogClose = () => {
    setUpdateOpen(false);
  };

  const getBaglantiByIdService = async (id) => {
    try {
      const response = await axios.get(
        `https://localhost:7031/Baglanti/Getbaglanti?id=${id}`,
        {
          headers: {
            authorization: `Bearer ${Cookie.get("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setUpdateForm(response.data);
        setUpdateOpen(true);
      }
    } catch (err) {}
  };

  const listService = async () => {
    try {
      const response = await axios.post(
        "https://localhost:7031/Baglanti/List",
        "",
        {
          headers: {
            authorization: `Bearer ${Cookie.get("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setData(response.data);
      }
    } catch (err) {}
  };
  useEffect(() => {
    listService();
  }, []);

  const createService = async () => {
    try {
      const reqBody = JSON.stringify({
        id: 0,
        sirketAd: form.sirketAd,
        baglantiAd: form.baglantiAd,
        baglantiId: form.baglantiId,
        baglantiSifre: form.baglantiSifre,
        yetkiliAd: form.yetkiliAd,
        yetkiliTel: form.yetkiliTel,
      });
      const response = await axios.post(
        "https://localhost:7031/Baglanti/Create",
        reqBody,
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            authorization: `Bearer ${Cookie.get("token")}`,
          },
        }
      );

      if (response.status === 200) {
        listService();
        dialogClose();
        setForm("");
      }
    } catch (err) {}
  };

  const uzakFormat = (data) => {
    if (data.length === 9) {
      return data.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
    } else if (data.length === 10) {
      return data.replace(/(\d{1})(\d{3})(\d{3})(\d{3})/, "$1 $2 $3 $4");
    } else {
      return data;
    }
  };

  const handleFiltreChange = (e) => {
    setFiltre(e.target.value);
  };

  const filtreleData = (veri, filtre) => {
    return veri.filter((row) =>
      Object.values(row).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes(filtre.toLowerCase())
      )
    );
  };

  const [open, setOpen] = useState(false);

  const dialogOpen = () => {
    setOpen(true);
  };

  const dialogClose = () => {
    setOpen(false);
  };

  const [snackOpen, setSnackOpen] = useState(false);
  const snackOpenClick = () => {
    setSnackOpen(true);
  };

  const snackCloseClick = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const deleteService = async (id) => {
    debugger;
    try {
      const reqBody = JSON.stringify({
        id: data.id,
        sirketAd: "",
        baglantiAd: "",
        baglantiId: "",
        baglantiSifre: "",
        yetkiliAd: "",
      });

      const response = await axios.delete(
        `https://localhost:7031/Baglanti/Delete?id=${id}`,

        {
          headers: {
            authorization: `Bearer ${Cookie.get("token")}`,
          },
        }
      );
      if (response.status === 200) {
        await listService();
        setAlertSeverity("success");
        setAlertMessage("Silme işlemi başarıyla gerçekleştirildi.");
      } else {
        setAlertSeverity("error");
        setAlertMessage("Silme işlemi başarısız oldu.");
      }
    } catch (err) {
      setAlertSeverity("error");
      setAlertMessage("Server error: " + err);
    }

    setSnackOpen(true);
  };

  return (
    <>
      <div className="border-box w-full flex flex-col h-full">
        <div className="flex justify-between gap-10  p-3 items-center ">
          <Button
            variant="contained"
            className="bg-slate-600 "
            size="large"
            startIcon={<IoCreateOutline />}
            sx={{
              "&:hover": {
                backgroundColor: "#778899",
              },
            }}
            onClick={dialogOpen}
          >
            <span>Ekle</span>
          </Button>
          <Dialog open={open} onClose={dialogClose} fullWidth>
            <DialogTitle
              className="text-center"
              style={{ background: "#2196f3", color: "#fff" }}
            >
              Uzak Bağlantı Oluşturma
            </DialogTitle>

            <DialogContent style={{ background: "#f0f0f0" }}>
              <div className="flex flex-col gap-3 p-3">
                <TextField
                  label="Şirket Adı"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={form.sirketAd}
                  onChange={(e) => {
                    setForm({ ...form, sirketAd: e.target.value });
                  }}
                />
                <TextField
                  label="Bağlantı Adı"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={form.baglantiAd}
                  onChange={(e) => {
                    setForm({ ...form, baglantiAd: e.target.value });
                  }}
                />
                <div className="flex justify-between gap-3">
                  <TextField
                    label="Bağlantı ID"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={form.baglantiId}
                    onChange={(e) => {
                      setForm({ ...form, baglantiId: e.target.value });
                    }}
                  />
                  <TextField
                    label="Bağlantı Şifre"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={form.baglantiSifre}
                    onChange={(e) => {
                      setForm({ ...form, baglantiSifre: e.target.value });
                    }}
                  />
                </div>
                <div className="flex justify-between gap-3">
                  <TextField
                    label="Yetkili Adı"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={form.yetkiliAd}
                    onChange={(e) => {
                      setForm({ ...form, yetkiliAd: e.target.value });
                    }}
                  />
                  <TextField
                    label="Yetkili Telefon"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={form.yetkiliTel}
                    onChange={(e) => {
                      setForm({ ...form, yetkiliTel: e.target.value });
                    }}
                  />
                </div>
              </div>
            </DialogContent>
            <DialogActions style={{ background: "#f0f0f0" }}>
              <Button variant="outlined" color="error" onClick={dialogClose}>
                Kapat
              </Button>
              <Button
                variant="contained"
                style={{ background: "#4caf50", color: "#fff" }}
                onClick={() => {
                  createService();
                }}
              >
                Oluştur
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={updateOpen} onClose={updateDialogClose} fullWidth>
            <DialogTitle
              className="text-center"
              style={{ background: "#000080", color: "#fff" }}
            >
              Uzak Bağlantı Güncelle
            </DialogTitle>

            <DialogContent style={{ background: "#f0f0f0" }}>
              <div className="flex flex-col gap-3 p-3">
                <TextField
                  label="Şirket Adı"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={updateform.sirketAd}
                  onChange={(e) => {
                    setUpdateForm({
                      ...updateform,
                      sirketAd: e.target.value,
                    });
                  }}
                />
                <TextField
                  label="Bağlantı Adı"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={updateform.baglantiAd}
                  onChange={(e) => {
                    setUpdateForm({
                      ...updateform,
                      baglantiAd: e.target.value,
                    });
                  }}
                />
                <div className="flex justify-between gap-3">
                  <TextField
                    label="Bağlantı ID"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={updateform.baglantiId}
                    onChange={(e) => {
                      setUpdateForm({
                        ...updateform,
                        baglantiId: e.target.value,
                      });
                    }}
                  />
                  <TextField
                    label="Bağlantı Şifre"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={updateform.baglantiSifre}
                    onChange={(e) => {
                      setUpdateForm({
                        ...updateform,
                        baglantiSifre: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="flex justify-between gap-3">
                  <TextField
                    label="Yetkili Adı"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={updateform.yetkiliAd}
                    onChange={(e) => {
                      setUpdateForm({
                        ...updateform,
                        yetkiliAd: e.target.value,
                      });
                    }}
                  />
                  <TextField
                    label="Yetkili Telefon"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={updateform.yetkiliTel}
                    onChange={(e) => {
                      setUpdateForm({
                        ...updateform,
                        yetkiliTel: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </DialogContent>
            <DialogActions style={{ background: "#f0f0f0" }}>
              <Button
                variant="outlined"
                color="error"
                onClick={updateDialogClose}
              >
                Kapat
              </Button>
              <Button
                variant="contained"
                style={{ background: "#4caf50", color: "#fff" }}
                onClick={() => {}}
              >
                Oluştur
              </Button>
            </DialogActions>
          </Dialog>

          <TextField
            id="outlined-basic"
            size="small"
            placeholder="Ara"
            sx={{
              width: "15%",
            }}
            color="secondary"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            value={filtre}
            onChange={handleFiltreChange}
          />
        </div>

        <div className="  md:w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200  ">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">
                  Şirket Ad
                </th>
                <th className="px-2 py-1 md:px-6 md:py-3text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto">
                  Bağlantı Tipi
                </th>
                <th className="px-2 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto">
                  Bağlantı ID
                </th>
                <th className="px-2 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto">
                  Bağlantı Şifre
                </th>
                <th className="px-2 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto">
                  Yetkili Ad
                </th>
                <th className="px-2 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto">
                  Yetkili Tel
                </th>
                <th className="px-2 py-1 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtreleData(data, filtre).map((row) => (
                <tr key={row?.id}>
                  <td className=" px-2 py-2 md:px-6  md:py-4 whitespace-nowrap">
                    {row?.sirketAd}
                  </td>
                  <td className="px-2 py-2 md:px-6  md:py-4 whitespace-nowrap">
                    {row?.baglantiAd}
                  </td>
                  <td className="px-2 py-2 md:px-6  md:py-4 whitespace-nowrap">
                    {uzakFormat(row?.baglantiId)}
                  </td>
                  <td className="px-2 py-2 md:px-6  md:py-4 whitespace-nowrap">
                    {row?.baglantiSifre}
                  </td>
                  <td className="px-2 py-2 md:px-6  md:py-4  whitespace-nowrap">
                    {row?.yetkiliAd}
                  </td>
                  <td className="px-2 py-2 md:px-6  md:py-4 whitespace-nowrap">
                    {row?.yetkiliTel.replace(
                      /(\d{4})(\d{3})(\d{2})(\d{2})/,
                      "$1 $2 $3 $4"
                    )}
                  </td>
                  <td className="px-2 py-2 md:px-6  md:py-4 whitespace-nowrap">
                    <div className="flex  gap-1">
                      <IconButton color="primary">
                        <EditIcon
                          onClick={() => {
                            getBaglantiByIdService(row?.id);
                          }}
                        />
                      </IconButton>

                      <IconButton color="error">
                        <DeleteIcon
                          onClick={() => {
                            deleteService(row?.id);
                          }}
                        />
                      </IconButton>

                      <Snackbar
                        open={snackOpen}
                        autoHideDuration={3000}
                        onClose={snackCloseClick}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                      >
                        <Alert
                          onClose={snackCloseClick}
                          severity={alertSeverity}
                          variant="filled"
                          sx={{ width: "100%" }}
                        >
                          {alertMessage}
                        </Alert>
                      </Snackbar>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
