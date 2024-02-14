import { useState, useEffect, useRef } from "react";
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

import Alert from "@mui/material/Alert";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector, useDispatch } from "react-redux";
import { list } from "postcss";

export default function UzakBaglanti() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const contentPing = useSelector((state) => state.contentPing.renew);
  const [filtre, setFiltre] = useState("");
  const dispatch = useDispatch();

  const refElm = useRef(null);
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
      const response = await axios.get(
        `https://localhost:7031/Baglanti/List?page=${currentPage + 1}`,
        {
          headers: {
            authorization: `Bearer ${Cookie.get("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setData((prevData) => [...prevData, ...response?.data?.data]);
        setCurrentPage((prevPage) => prevPage + 1);
        setHasMore(currentPage < totalPageCount);
      }
    } catch (err) {
      setHasMore(false);
    }
  };
  const getList = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7031/Baglanti/List?page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${Cookie.get("token")}`,
          },
        }
      );

      if (response.status === 200) {
        setData(response?.data?.data);
        setTotalPageCount(response?.data?.totalPages);
        dispatch({
          type: "REFETCH_CONTENT",
          payload: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getList();
    if (contentPing) {
      getList();
    }
  }, [contentPing]);

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
        dialogClose();
        setForm("");
        await getList();
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
    try {
      const response = await axios.delete(
        `https://localhost:7031/Baglanti/Delete?id=${id}`,

        {
          headers: {
            authorization: `Bearer ${Cookie.get("token")}`,
          },
        }
      );
      if (response.status === 200) {
        debugger;

        setAlertSeverity("success");
        setAlertMessage("Silme işlemi başarıyla gerçekleştirildi.");
        setCurrentPage(1);
        getList();
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

  const updateService = async (id) => {
    const reqBody = JSON.stringify({
      id: updateform.id,
      sirketAd: updateform.sirketAd,
      baglantiAd: updateform.baglantiAd,
      baglantiId: updateform.baglantiId,
      baglantiSifre: updateform.baglantiSifre,
      yetkiliAd: updateform.yetkiliAd,
      yetkiliTel: updateform.yetkiliTel,
    });
    try {
      const response = await axios.put(
        `https://localhost:7031/Baglanti/${id}`,
        {
          id: updateform.id,
          sirketAd: updateform.sirketAd,
          baglantiAd: updateform.baglantiAd,
          baglantiId: updateform.baglantiId,
          baglantiSifre: updateform.baglantiSifre,
          yetkiliAd: updateform.yetkiliAd,
          yetkiliTel: updateform.yetkiliTel,
        },
        {
          headers: {
            authorization: `Bearer ${Cookie.get("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setAlertSeverity("success");
        setAlertMessage("Başarıyla Güncellendi.");
        setCurrentPage(1);
        setTotalPageCount(1);
        getList();
      } else {
        setAlertSeverity("error");
        setAlertMessage("Güncelleme işlemi başarısız oldu.");
      }
      setSnackOpen(true);
    } catch (err) {}
  };

  return (
    <>
      <div ref={refElm} className="border-box w-full flex flex-col h-full">
        <InfiniteScroll
          dataLength={data?.length}
          next={() => {
            listService();
          }}
          hasMore={hasMore}
          loader={
            hasMore && (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            )
          }
        >
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
                  onClick={() => {
                    updateService(updateform.id);
                    updateDialogClose();
                  }}
                >
                  Güncelle
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

          <div className="md:w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-sky-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">
                    Şirket Ad
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">
                    Bağlantı Tipi
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">
                    Bağlantı ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">
                    Bağlantı Şifre
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">
                    Yetkili Ad
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">
                    Yetkili Tel
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filtreleData(data, filtre).map((row) => {
                  return (
                    <tr key={row?.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {row?.sirketAd}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {row?.baglantiAd}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {uzakFormat(row?.baglantiId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {row?.baglantiSifre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {row?.yetkiliAd}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {row?.yetkiliTel.replace(
                          /(\d{4})(\d{3})(\d{2})(\d{2})/,
                          "$1 $2 $3 $4"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <IconButton color="primary" size="small">
                            <EditIcon
                              onClick={() => {
                                getBaglantiByIdService(row?.id);
                              }}
                            />
                          </IconButton>

                          <IconButton color="error" size="small">
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </InfiniteScroll>
      </div>
    </>
  );
}
