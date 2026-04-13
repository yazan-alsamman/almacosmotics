import { Outlet } from 'react-router-dom';
import FloatingParticles from '@/components/FloatingParticles';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';

export function StorefrontLayout() {
  return (
    <>
      <FloatingParticles />
      <Navbar />
      <CartDrawer />
      {/* z-10 keeps page content above decorative layer; links remain clickable */}
      <div className="relative z-10 min-h-[calc(100vh-4rem)]">
        <Outlet />
      </div>
    </>
  );
}
