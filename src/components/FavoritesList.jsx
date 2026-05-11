const FavoritesList = ({ favorites, onSelect }) => {
  if (!favorites || favorites.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-medium text-white mb-4 pl-2">Favorites</h3>
      <div className="flex flex-wrap gap-3">
        {favorites.map((city) => (
          <button
            key={city}
            onClick={() => onSelect(city)}
            className="glass px-4 py-2 rounded-full text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
