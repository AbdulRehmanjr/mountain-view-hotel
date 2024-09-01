import Image from "next/image";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { cn } from "~/lib/utils";

type CarouselProps = {
  images: string[];
  className?: string;
};

export const RoomImageCarousel = ({ images, className }: CarouselProps) => {
  return (
    <div className={cn("w-full", className)}>
      <Carousel>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={image ?? ""}
                  alt={`Room image ${index + 1}`}
                  fill
                  className="rounded-lg object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </AspectRatio>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 transform" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 transform" />
      </Carousel>
    </div>
  );
};