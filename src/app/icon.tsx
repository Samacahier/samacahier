import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 7,
          backgroundColor: "#5a3723",
          color: "#d97b1e",
          fontFamily: "sans-serif",
          fontWeight: 800,
          fontSize: 22,
        }}
      >
        S
      </div>
    ),
    { ...size },
  );
}
