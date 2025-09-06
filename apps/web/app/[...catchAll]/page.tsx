'use client';

// Importando o componente NotFound para renderizá-lo diretamente
import NotFound from '../not-found';

// Este componente captura todas as rotas indefinidas e renderiza a página NotFound diretamente
export default function CatchAll() {
  // Em vez de redirecionar, renderizamos a página NotFound diretamente
  return <NotFound />;
}
