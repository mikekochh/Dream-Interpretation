"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    router.replace('/interpret');
  }, [router])

  return null;

  // return (
  //   <main>
  //     <HomePage />
  //   </main>
  // )
}
