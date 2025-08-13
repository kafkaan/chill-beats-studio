import { useState } from "react";
import heroDefault from "@/assets/hero-lofi.jpg";
import heroCafe from "@/assets/hero-cafe.jpg";
import heroDesk from "@/assets/hero-desk.jpg";
import heroFireplace from "@/assets/hero-fireplace.jpg";
import ControlPanel from "@/features/lofi/ControlPanel";
import PomodoroTimer from "@/features/lofi/PomodoroTimer";

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
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/40 to-background/10" />
      </div>

      {/* Hero section */}
      <section className="container mx-auto pt-20 pb-10">
        <div className="text-center animate-enter">
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-4">
            Lofi Focus Studio
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Mixez des ambiances sonores et restez concentré(e) avec un minuteur Pomodoro élégant.
          </p>
        </div>

        {/* Image picker */}
        <div className="mt-8 flex items-center justify-center gap-3">
          {images.map((img) => (
            <button
              key={img.label}
              onClick={() => setBg(img.src)}
              className={`rounded-md overflow-hidden border hover-scale ${bg === img.src ? 'ring-2 ring-primary' : ''}`}
              aria-label={`Choisir l'image ${img.label}`}
            >
              <img src={img.src} alt={`Arrière-plan ${img.label}`} className="h-16 w-24 object-cover" />
            </button>
          ))}
        </div>
      </section>

      {/* Studio section */}
      <section className="container mx-auto pb-16" id="studio">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ControlPanel />
          </div>
          <div>
            <PomodoroTimer />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
