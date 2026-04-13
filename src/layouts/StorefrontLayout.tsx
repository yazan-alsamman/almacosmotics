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
      <Outlet />
    </>
  );
}
