export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Financial AI Agent
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Seu assistente financeiro inteligente baseado em IA
        </p>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-4">
            Projeto em Desenvolvimento
          </h2>
          <p className="text-muted-foreground">
            Esta é a fundação do projeto Financial AI Agent. 
            A implementação das funcionalidades será feita nas próximas tarefas.
          </p>
        </div>
      </div>
    </main>
  );
}