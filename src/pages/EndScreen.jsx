import Card from "../components/Card";

const STATES = {
  completed: {
    emoji: "🎉",
    title: "Session Complete!",
    subtitle: "Great work! Take a short break.",
    subtitleColor: "text-emerald-400",
  },
  stopped: {
    emoji: "😢",
    title: "You stopped early",
    subtitle: "No worries — try again when you're ready.",
    subtitleColor: "text-gray-400",
  },
};

export default function EndScreen({ completed, onRestart }) {
  const { emoji, title, subtitle, subtitleColor } = completed
    ? STATES.completed
    : STATES.stopped;

  return (
    <Card>
      <div className="text-6xl mb-5 select-none">{emoji}</div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className={`text-sm mb-10 ${subtitleColor}`}>{subtitle}</p>

      <button
        onClick={onRestart}
        className="w-full bg-rose-500 hover:bg-rose-600 active:scale-95 transition-all duration-150 text-white font-semibold py-3 rounded-2xl text-base shadow-md shadow-rose-200"
      >
        Restart
      </button>
    </Card>
  );
}
