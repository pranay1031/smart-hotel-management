function RoomCard({ title, price, image }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden hover:scale-105 transition duration-300">

      <img
        src={image}
        alt={title}
        className="h-64 w-full object-cover"
      />

      <div className="p-6">

        <h2 className="text-2xl font-bold mb-3">
          {title}
        </h2>

        <p className="text-gray-400 mb-4">
          Premium luxury experience with AI smart services.
        </p>

        <div className="flex items-center justify-between">

          <h3 className="text-cyan-400 text-2xl font-bold">
            ₹{price}
          </h3>

          <button className="bg-cyan-500 hover:bg-cyan-400 transition px-5 py-3 rounded-xl text-black font-bold">
            Book Now
          </button>

        </div>

      </div>

    </div>
  );
}

export default RoomCard;