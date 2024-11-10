import { ImageResponse } from "next/og";
import Image from "next/image";

export const runtime = "edge";
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          width: "100%",
          height: "100%",
        }}>
        <Image
          src="/icon.png"
          width={64}
          height={64}
          alt={"favicon de l'application Okaze"}
        />
      </div>
    )
  );
}
