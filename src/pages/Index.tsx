import { useState } from "react";
import heroDefault from "@/assets/hero-lofi.jpg";
import heroCafe from "@/assets/hero-cafe.jpg";
import heroDesk from "@/assets/hero-desk.jpg";
import heroFireplace from "@/assets/hero-fireplace.jpg";
import ControlPanel from "@/features/lofi/ControlPanel";
import PomodoroTimer from "@/features/lofi/PomodoroTimer";
import BackgroundPicker from "@/features/lofi/BackgroundPicker";
import YouTubePlayer from "@/features/lofi/YouTubePlayer";

const images = [
  { src: heroDefault, label: "Lofi" },
  { src: heroCafe, label: "Café" },
  { src: heroDesk, label: "Bureau" },
  { src: heroFireplace, label: "Cheminée" },
];

const Index = () => {
  const [bg, setBg] = useState(images[0].src);

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Hero background */}
      <div className="absolute inset-0 -z-10">
        <img src={bg} alt="Fond lofi pour la concentration" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-background/20 to-background/0" />
      </div>

      {/* Hero section with discreet controls */}
      <section className="container mx-auto pt-24 pb-8 relative">
        <BackgroundPicker options={images} value={bg} onChange={setBg} />
        <div className="text-center animate-enter">
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-3">
            Lofi Focus Studio
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Mixez des ambiances et écoutez votre musique YouTube tout en restant concentré(e).
          </p>
        </div>
      </section>

      {/* Studio section */}
      <section className="container mx-auto pb-16" id="studio">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ControlPanel />
          </div>
          <div className="space-y-6">
            <PomodoroTimer />
            <YouTubePlayer />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
