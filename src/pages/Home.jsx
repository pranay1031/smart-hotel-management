import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedRooms from "../components/FeaturedRooms";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="bg-black text-white">

      <Navbar />

      <Hero />

      <FeaturedRooms />

      <Footer />

    </div>
  );
}

export default Home;