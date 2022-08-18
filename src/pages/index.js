import { Paper } from "@mui/material";
import Head from "next/head";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Paper
        sx={{
          width: "200px",
          height: "200px",
          borderRadius: "12px",
          boxShadow: "none",
        }}
      ></Paper>
    </div>
  );
}
