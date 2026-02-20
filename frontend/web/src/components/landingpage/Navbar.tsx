import Link from "next/link";
import Image from "next/image";
import { User, Heart, ShoppingBag } from "lucide-react";
import Container from "./ Container";

const Navbar = () => {
  return (
    <nav className="py-6 w-full">
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6">
              <Image
                src="/images/leaf.png"
                alt="Healix Leaf"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight">Healix</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-10 text-lg font-medium text-gray-800">
            <a href="/store" className="hover:text-green-600">Shop</a>
            <a href="#">Health Goals</a>
            <a href="#">Blog</a>
            <a href="#">About</a>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-6">
            <Link href="/profile">
              <User className="w-6 h-6" />
            </Link>
            <Link href="/">
              <Heart className="w-6 h-6" />
            </Link>
            <Link href="/cart">
              <ShoppingBag className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;