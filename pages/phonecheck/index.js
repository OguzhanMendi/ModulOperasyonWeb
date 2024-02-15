import { useRef } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function Index() {
  const textFields = useRef([]);

  const handleInputChange = (index, event) => {
    const value = event.target.value;
    if (value !== "" && index < textFields.current.length - 1) {
      // Metin kutusuna yeni bir karakter girildiyse ve son metin kutusu değilse
      textFields.current[index + 1].focus(); // Bir sonraki metin kutusuna odaklan
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      // Eğer Backspace tuşuna basıldıysa
      if (index > 0) {
        // Eğer ilk metin kutusu değilse
        textFields.current[index - 1].focus(); // Bir önceki metin kutusuna odaklan
      }
    }
  };

  return (
    <>
      <div className=" flex justify-center items-center h-screen">
        <div className="w-1/2 bg-slate-400 p-5  rounded-lg">
          <div className="flex justify-center ">
            <h1 className="text-2xl font-semibold">
              Lütfen Doğrulama Kodunu Giriniz...
            </h1>
          </div>
          <div className="flex justify-center gap-3 mt-5 ">
            {[...Array(6)].map((_, index) => (
              <TextField
                key={index}
                inputProps={{
                  ref: (el) => (textFields.current[index] = el),
                  maxLength: 1,
                  style: { textAlign: "center" },
                }}
                id={`outlined-size-small-${index}`}
                size="large"
                sx={{
                  width: "8%",
                }}
                onChange={(event) => handleInputChange(index, event)}
                onKeyDown={(event) => handleKeyDown(index, event)}
              />
            ))}
          </div>

          <div className="flex justify-center mt-5">
            <Button variant="contained" size="large">
              Gönder
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
