import {  HeaderNav, MiComponente  } from '../components/ui/index';
import Image from "next/image";
import Link from "next/link";

export  default function Page() {
  return (
    <div>
     
      <h1>Welcome to Create Next App</h1>
      <Image
        src="/logo.svg"
        alt="Create Next App logo"
        width={200}
        height={200}
      />
      <MiComponente />
      <Link href="/api">API</Link>
    </div>
  );
}