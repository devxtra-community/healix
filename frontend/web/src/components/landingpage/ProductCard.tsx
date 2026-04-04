import Image from 'next/image';

type Props = {
  imageSrc: string;
  heightClass: string;
  title: string;
  bgColor?: string;
};

const ProductCard = ({
  imageSrc,
  heightClass,
  title,
  bgColor ,
}: Props) => {
  return (
    <div
      className={`${heightClass} ${bgColor} w-full rounded-3xl relative overflow-hidden group transition-transform duration-500 hover:scale-[1.02]`}
    >
      <Image
        src={imageSrc}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width:768px)100vw,(max-width:1200px)50vw,33vw"
      />
    </div>
  );
};

export default ProductCard;
