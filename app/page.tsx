import Image from "next/image";
import ImageAnnotation from "../components/imageAnnotation";
import { CanvasProvider } from "@/context/CanvasContext";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 lg:p-16 xl:p-24 ">
      <div className="bg-gray-100 rounded-md z-10 w-full h-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <CanvasProvider>
          <ImageAnnotation />
        </CanvasProvider>
      </div>
    </main>
  );
}
