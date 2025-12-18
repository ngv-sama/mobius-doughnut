import MobiusStrip from "./components/MobiusStrip";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold text-green-400 font-mono tracking-wider">
          SPINNING MÖBIUS STRIP
        </h1>
        <MobiusStrip />
        <p className="text-green-400/60 font-mono text-sm">
          A 3D Möbius strip rendered in ASCII characters
        </p>
      </div>
    </div>
  );
}
