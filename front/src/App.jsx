import GlowBackground from "./components/GlowBackground";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import UploadSection from "./components/UploadSection";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import { initScrollAnimation } from "./utils/scrollAnimation";

function App() {
  useEffect(() => { initScrollAnimation(); }, []);
  const [modelUrl, setModelUrl] = useState(null);

  return (
    <>
    <GlowBackground />
    <Navbar/> 
    <Hero className="scroll-animate" modelUrl={modelUrl}/>
    <UploadSection className="scroll-animate" setModelUrl={setModelUrl}/>
    <Footer className="scroll-animate"/>
    </>
  );
}

export default App;
