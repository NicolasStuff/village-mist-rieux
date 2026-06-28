import Image from "next/image";
import { cn } from "@/lib/ui";

type CardFrameProps = {
  title: string;
  subtitle: string;
  image: string;
  children?: React.ReactNode;
  className?: string;
};

export function CardFrame({ title, subtitle, image, children, className }: CardFrameProps) {
  return (
    <article className={cn("card-frame", className)}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-stone-900">
        <Image src={image} alt="" fill sizes="(max-width: 768px) 80vw, 320px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-amber-200">{subtitle}</p>
          <h2 className="mt-1 text-balance text-2xl font-black text-stone-50">{title}</h2>
        </div>
      </div>
      {children ? <div className="mt-3 text-sm leading-6 text-stone-200">{children}</div> : null}
    </article>
  );
}
