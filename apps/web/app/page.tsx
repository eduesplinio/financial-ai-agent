import { redirect } from 'next/navigation';

export default function HomePage() {
  // Sempre redireciona para signin - o middleware cuidará do resto
  redirect('/auth/signin');
}
