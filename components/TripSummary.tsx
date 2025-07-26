import Image from "next/image";

import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
} from "@tabler/icons-react";

export function TripSummary() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center text-indigo-700 mb-10">
        Trip Highlights
      </h2>
      <BentoGrid className="max-w-4xl mx-auto">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            icon={item.icon}
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
          />
        ))}
      </BentoGrid>
    </div>
  );
}

const items = [
  {
    title: "Himalayan Escapade",
    description:
      "Experience the chill and thrill of Manali’s snowy peaks and adventure sports like skiing and ziplining.",
    header: (
      <Image
        src="/images/day5.jpg"
        alt="Shimla"
        width={800}
        height={320}
        className="w-full h-40 object-cover rounded-lg"
      />
    ),
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Shimla’s Colonial Charm",
    description:
      "Walk through Mall Road, visit Christ Church, and take in the old-world beauty of Shimla.",
    header: (
      <Image
        src="/images/day3.1.jpg"
        alt="Shimla"
        width={800}
        height={320}
        className="w-full h-40 object-cover rounded-lg"
      />
    ),

    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "5 & 4 Star Hotels",
    description:
      "Enjoy luxurious stays in top-rated hotels with stunning views and modern amenities.",
    header: (
      <Image
        src="/images/hotel.jpg"
        alt="Hotel"
        width={800}
        height={320}
        className="w-full h-40 object-cover rounded-lg"
      />
    ),

    icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
  },

  {
    title: "DJ Night & Bonfire",
    description:
      "Dance under the stars and warm up by the bonfire — the most awaited party night of the trip!",
    header: (
      <Image
        src="/images/dj.jpg"
        alt="Shimla"
        width={800}
        height={320}
        className="w-full h-40 object-cover rounded-lg"
      />
    ),

    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },

  {
    title: "All-Inclusive Travel",
    description:
      "Train + Bus + Hotel + Meals + Sightseeing — everything is arranged for a smooth and fun experience.",
    header: (
      <Image
        src="/images/day1.jpg"
        alt="Shimla"
        width={800}
        height={320}
        className="w-full h-40 object-cover rounded-lg"
      />
    ),

    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
];
