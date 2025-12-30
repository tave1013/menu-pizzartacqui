export const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">PizzArt</h1>
      </div>

      {/* Contenitore principale - Solo testo */}
      <div className="w-full flex flex-col items-center justify-center px-4 sm:px-8">
        {/* Subtitle - in verde */}
        <p className="text-sm sm:text-base text-green-600 mb-2 sm:mb-4 text-center font-medium">
          Novità in arrivo
        </p>

        {/* Titolo principale */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 text-center leading-tight max-w-2xl">
          Stiamo preparando un'esperienza ancora migliore per te!
        </h2>

        {/* Decorazione - linea stilizzata */}
        <div className="mt-4 sm:mt-6">
          <svg width="120" height="30" viewBox="0 0 120 30" className="mx-auto opacity-70">
            <path
              d="M 10 15 Q 30 5, 50 15 T 90 15"
              stroke="#82b856"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Testo secondario - in verde */}
        <p className="mt-6 sm:mt-8 text-sm sm:text-base text-green-700 text-center max-w-md">
          Torna a trovarci presto!
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
