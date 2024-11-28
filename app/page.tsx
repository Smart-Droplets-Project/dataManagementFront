import { Typography } from "@mui/material";
import Image from "next/image";
import GridLayout from "./components/GridLayout";

export default function Home() {
  return (
    <GridLayout>

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
      </div>
    </GridLayout>
  );
}
