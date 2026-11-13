import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type DoctorCardProps = {
  doctor: {
    slug: string;
    name: string;
    position: string;
    experience: number;
    photoUrl: string;
  };
};

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <article className="group overflow-hidden rounded-4xl bg-white">
      <Link href={`/doctors/${doctor.slug}`} className="focus-ring block rounded-4xl">
        <div className="relative aspect-[4/4.6] overflow-hidden bg-mint">
          <Image
            src={doctor.photoUrl}
            alt={`Illustrated avatar of ${doctor.name}, a fictional dentist`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-teal">Fictional profile</span>
          <span className="absolute bottom-5 right-5 grid h-11 w-11 place-items-center rounded-full bg-white text-teal">
            <ArrowUpRight size={19} aria-hidden="true" />
          </span>
        </div>
        <div className="p-6">
          <h3 className="display-title text-2xl">{doctor.name}</h3>
          <p className="mt-2 text-sm leading-6 text-ink/60">{doctor.position}</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-teal">{doctor.experience} years · illustrative experience</p>
        </div>
      </Link>
    </article>
  );
}
