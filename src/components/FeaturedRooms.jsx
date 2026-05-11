import RoomCard from "./RoomCard";

function FeaturedRooms() {

  const rooms = [
    {
      title: "Luxury Suite",
      price: 15000,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    },

    {
      title: "Premium Deluxe",
      price: 10000,
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    },

    {
      title: "Ocean View Room",
      price: 18000,
      image:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
    },
  ];

  return (
    <section className="py-24 px-8">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
          Featured Rooms
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

          {rooms.map((room, index) => (
            <RoomCard
              key={index}
              title={room.title}
              price={room.price}
              image={room.image}
            />
          ))}

        </div>

      </div>

    </section>
  );
}

export default FeaturedRooms;