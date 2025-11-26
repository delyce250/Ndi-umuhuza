import Image from 'next/image';
import React from 'react';

const ANGE_IMG = 'DIRECT_IMAGE_URL_FOR_ANGE';   // replace with direct URL from https://postimg.cc/LnYzBqB4
const DELYCE_IMG = 'DIRECT_IMAGE_URL_FOR_DELYCE'; // replace with direct URL from https://postimg.cc/w7yhctcq

type Member = { name: string; role?: string; src: string };

const members: Member[] = [
  { name: 'ANGE',  role: 'Project Lead', src: ANGE_IMG },
  { name: 'DELYCE', role: 'Designer',     src: DELYCE_IMG },
];

export default function Team() {
  return (
    <section className="py-8 px-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Our Team</h2>
      <div className="flex gap-6 items-center">
        {members.map((m) => (
          <div key={m.name} className="flex items-center gap-4">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              <Image src={m.src} alt={m.name} width={112} height={112} className="object-cover" />
            </div>
            <div>
              <div className="font-bold">{m.name}</div>
              {m.role && <div className="text-sm text-gray-600">{m.role}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}