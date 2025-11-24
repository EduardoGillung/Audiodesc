import Link from "next/link";

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-8 text-sm"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar
        </Link>

        <h1 className="text-4xl font-bold text-yellow-400 mb-4">
          Termos de Uso
        </h1>
        <p className="text-zinc-400 mb-8">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>

        <div className="space-y-8 text-zinc-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              1. Aceitação dos Termos
            </h2>
            <p className="leading-relaxed">
              Ao acessar e usar o Audiodesc ("Serviço"), você concorda em
              cumprir e estar vinculado a estes Termos de Uso. Se você não
              concordar com qualquer parte destes termos, não use nosso serviço.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              2. Descrição do Serviço
            </h2>
            <p className="leading-relaxed">
              O Audiodesc é uma plataforma de transcrição de áudio que converte
              arquivos de áudio em texto usando inteligência artificial. O
              serviço também oferece recursos de geração de resumos, tarefas e
              respostas baseadas no conteúdo transcrito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. Cadastro e Conta
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-2">
                  3.1 Elegibilidade
                </h3>
                <p className="leading-relaxed">
                  Você deve ter pelo menos 18 anos para usar este serviço. Ao
                  criar uma conta, você declara que tem idade legal para formar
                  um contrato vinculativo.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-2">
                  3.2 Informações da Conta
                </h3>
                <p className="leading-relaxed">
                  Você é responsável por manter a confidencialidade de suas
                  credenciais de login e por todas as atividades que ocorram em
                  sua conta. Você concorda em fornecer informações precisas e
                  atualizadas.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-2">
                  3.3 Segurança da Conta
                </h3>
                <p className="leading-relaxed">
                  Você deve notificar-nos imediatamente sobre qualquer uso não
                  autorizado de sua conta. Não nos responsabilizamos por perdas
                  decorrentes do uso não autorizado de sua conta.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. Uso Aceitável
            </h2>
            <p className="leading-relaxed mb-4">
              Você concorda em NÃO usar o serviço para:
            </p>
            <ul className="list-disc list-inside space-y-2 leading-relaxed">
              <li>Violar leis ou regulamentos aplicáveis</li>
              <li>Infringir direitos de propriedade intelectual</li>
              <li>Transcrever conteúdo ilegal, ofensivo ou prejudicial</li>
              <li>Fazer upload de malware ou código malicioso</li>
              <li>Tentar acessar sistemas não autorizados</li>
              <li>Fazer engenharia reversa do serviço</li>
              <li>Usar o serviço para spam ou phishing</li>
              <li>Revender ou redistribuir o serviço sem autorização</li>
              <li>Sobrecarregar ou interferir com a infraestrutura</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              5. Conteúdo do Usuário
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-2">
                  5.1 Propriedade
                </h3>
                <p className="leading-relaxed">
                  Você mantém todos os direitos sobre o conteúdo que envia
                  (arquivos de áudio e transcrições). Ao usar o serviço, você
                  nos concede uma licença limitada para processar e armazenar
                  seu conteúdo.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-2">
                  5.2 Responsabilidade
                </h3>
                <p className="leading-relaxed">
                  Você é o único responsável pelo conteúdo que envia. Você
                  garante que possui todos os direitos necessários e que o
                  conteúdo não viola direitos de terceiros.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-2">
                  5.3 Remoção de Conteúdo
                </h3>
                <p className="leading-relaxed">
                  Reservamo-nos o direito de remover qualquer conteúdo que
                  viole estes termos ou que consideremos inadequado, sem aviso
                  prévio.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              6. Propriedade Intelectual
            </h2>
            <p className="leading-relaxed">
              O serviço, incluindo seu design, código, logotipos e conteúdo
              original, é protegido por direitos autorais e outras leis de
              propriedade intelectual. Você não pode copiar, modificar ou
              distribuir nosso conteúdo sem permissão expressa.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              7. Limitações do Serviço
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-2">
                  7.1 Disponibilidade
                </h3>
                <p className="leading-relaxed">
                  Não garantimos que o serviço estará disponível
                  ininterruptamente ou livre de erros. Podemos suspender o
                  serviço para manutenção ou atualizações.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-2">
                  7.2 Precisão
                </h3>
                <p className="leading-relaxed">
                  Embora nos esforcemos para fornecer transcrições precisas, não
                  garantimos 100% de precisão. A qualidade depende de fatores
                  como qualidade do áudio, sotaque e ruído de fundo.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-2">
                  7.3 Limites de Uso
                </h3>
                <p className="leading-relaxed">
                  Podemos impor limites razoáveis de uso, como tamanho máximo de
                  arquivo ou número de transcrições por período, para garantir a
                  qualidade do serviço para todos os usuários.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              8. Pagamentos e Reembolsos
            </h2>
            <p className="leading-relaxed">
              Atualmente, o serviço é oferecido gratuitamente. Se
              implementarmos planos pagos no futuro, os termos de pagamento e
              reembolso serão claramente comunicados antes da cobrança.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              9. Rescisão
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-2">
                  9.1 Por Você
                </h3>
                <p className="leading-relaxed">
                  Você pode encerrar sua conta a qualquer momento através das
                  configurações da conta ou entrando em contato conosco.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-2">
                  9.2 Por Nós
                </h3>
                <p className="leading-relaxed">
                  Podemos suspender ou encerrar sua conta se você violar estes
                  termos, sem aviso prévio e sem reembolso.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-2">
                  9.3 Efeitos da Rescisão
                </h3>
                <p className="leading-relaxed">
                  Após o encerramento, você perderá acesso ao serviço e seus
                  dados poderão ser deletados conforme nossa política de
                  retenção.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              10. Isenção de Garantias
            </h2>
            <p className="leading-relaxed">
              O SERVIÇO É FORNECIDO "COMO ESTÁ" E "CONFORME DISPONÍVEL", SEM
              GARANTIAS DE QUALQUER TIPO, EXPRESSAS OU IMPLÍCITAS. NÃO
              GARANTIMOS QUE O SERVIÇO ATENDERÁ SUAS NECESSIDADES OU SERÁ LIVRE
              DE ERROS.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              11. Limitação de Responsabilidade
            </h2>
            <p className="leading-relaxed">
              EM NENHUMA CIRCUNSTÂNCIA SEREMOS RESPONSÁVEIS POR DANOS INDIRETOS,
              INCIDENTAIS, ESPECIAIS OU CONSEQUENCIAIS DECORRENTES DO USO OU
              INCAPACIDADE DE USAR O SERVIÇO, MESMO QUE TENHAMOS SIDO AVISADOS
              DA POSSIBILIDADE DE TAIS DANOS.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              12. Indenização
            </h2>
            <p className="leading-relaxed">
              Você concorda em indenizar e isentar o Audiodesc de quaisquer
              reivindicações, danos ou despesas decorrentes de seu uso do
              serviço ou violação destes termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              13. Alterações nos Termos
            </h2>
            <p className="leading-relaxed">
              Reservamo-nos o direito de modificar estes termos a qualquer
              momento. Notificaremos você sobre mudanças significativas. O uso
              continuado do serviço após as alterações constitui aceitação dos
              novos termos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              14. Lei Aplicável
            </h2>
            <p className="leading-relaxed">
              Estes termos são regidos pelas leis do Brasil. Quaisquer disputas
              serão resolvidas nos tribunais competentes do Brasil.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              15. Contato
            </h2>
            <p className="leading-relaxed">
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato
              conosco:
            </p>
            <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
              <p className="text-zinc-300">
                Email:{" "}
                <a
                  href="mailto:suporte@audiodesc.com"
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  suporte@audiodesc.com
                </a>
              </p>
              <p className="text-zinc-300 mt-2">
                Ou através da nossa{" "}
                <Link
                  href="/contato"
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  página de contato
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
