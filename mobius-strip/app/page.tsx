import MobiusStrip from "./components/MobiusStrip";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent font-mono tracking-wider">
          RAINBOW MÖBIUS STRIP
        </h1>
        <MobiusStrip />
        <p className="text-white/60 font-mono text-sm">
          A hypnotic 3D rainbow optical illusion
        </p>
      </div>
    </div>
  );
}
