import Card from "../components/Card";

export default function StartScreen({ onStart }) {
  return (
    <Card>
      {/* Icon */}
      <div className="text-6xl mb-5 select-none">🍅</div>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Ready to focus?
      </h1>
      <p className="text-gray-400 text-sm mb-10">
        25-minute Pomodoro session
      </p>

      {/* CTA */}
      <button
        onClick={onStart}
        className="w-full bg-rose-500 hover:bg-rose-600 active:scale-95 transition-all duration-150 text-white font-semibold py-3 rounded-2xl text-base shadow-md shadow-rose-200"
      >
        Start
      </button>
    </Card>
  );
}
