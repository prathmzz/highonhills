"use client";
import { motion } from "motion/react";
import React, { useState } from "react";
import { ImagesSlider } from "@/components/ui/images-slider";
import Modal from "./animata/overlay/modal";
export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const images = [
    "/images/hero1.jpg",
    "/images/hero2.jpg",
    "/images/hero3.jpg",
    "/images/hero4.jpg",
   
  ];
  return (
    <ImagesSlider className="h-[40rem]" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          VESIT BE TRIP to HIMACHAL PRADESH<br /> for the BATCH OF 2026
        </motion.p>
        <button
        onClick={() => setIsModalOpen(true)}
        className="mt-8 rounded bg-white px-6 py-3 text-lg font-semibold text-indigo-800 transition hover:opacity-90"
      >
        Book your Seat now →
      </button>

      <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      </motion.div>
    </ImagesSlider>
  );
}
