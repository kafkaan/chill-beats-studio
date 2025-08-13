import hero from "@/assets/hero-lofi.jpg";
import ControlPanel from "@/features/lofi/ControlPanel";
import PomodoroTimer from "@/features/lofi/PomodoroTimer";

const Index = () => {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Hero background */}
      <div className="absolute inset-0 -z-10">
        <img src={hero} alt="Lofi workspace illustration for focus and ambient sounds" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/60 to-background/30" />
      </div>

      <section className="container mx-auto py-16">
        <div className="text-center animate-enter">
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-4">
            Lofi Focus Studio
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Mixez des ambiances sonores et restez concentré(e) avec un minuteur Pomodoro élégant.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a href="#studio" className="story-link text-primary">Découvrir le studio</a>
          </div>
        </div>

        <div id="studio" className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
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
