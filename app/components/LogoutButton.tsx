// components/LogoutButton.tsx
'use client';

import { createBrowserClient } from '@supabase/ssr'; // MUDANÇA CRUCIAL
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout} 
      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
    >
      Sair
    </button>
  );
}
