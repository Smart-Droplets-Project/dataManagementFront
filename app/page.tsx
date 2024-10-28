import { Typography } from "@mui/material";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col items-center gap-4">

        <Image
          src="/images/Smart-droplets-logo.svg"
          alt="Smart Droplets logo"
          width={720}
          height={152}
          priority
        />
        <Typography variant="h4">
          Welcome to the Smart Droplets Dashboard!
        </Typography>
      </div>

      <footer className="flex justify-center gap-10">
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={24}
            height={16}
          />
          <Typography variant="h6">
            Learn
          </Typography>
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={24}
            height={16}
          />
          <Typography variant="h6">
            Examples
          </Typography>
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={24}
            height={16}
          />
          <Typography variant="h6">
            Go to nextjs.org →
          </Typography>
        </a>
      </footer>
    </div>
  );
}
