import Link from "next/link";

export default function PrivacidadePage() {
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
          Política de Privacidade
        </h1>
        <p className="text-zinc-400 mb-8">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>

        <div className="space-y-8 text-zinc-300">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              1. Introdução
            </h2>
            <p className="leading-relaxed">
              A Audiodesc ("nós", "nosso" ou "nossa") está comprometida em
              proteger sua privacidade. Esta Política de Privacidade explica
              como coletamos, usamos, divulgamos e protegemos suas informações
              quando você usa nosso serviço de transcrição de áudio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              2. Informações que Coletamos
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-2">
                  2.1 Informações de Conta
                </h3>
                <p className="leading-relaxed">
                  Quando você cria uma conta, coletamos seu endereço de email e
                  senha criptografada. Se você usar login social (Google),
                  coletamos informações básicas do perfil fornecidas pelo
                  provedor.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-2">
                  2.2 Arquivos de Áudio
                </h3>
                <p className="leading-relaxed">
                  Processamos arquivos de áudio que você envia para transcrição.
                  Os arquivos são processados temporariamente e não são
                  armazenados permanentemente em nossos servidores após a
                  transcrição.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-2">
                  2.3 Transcrições
                </h3>
                <p className="leading-relaxed">
                  Armazenamos o texto transcrito associado à sua conta para que
                  você possa acessá-lo posteriormente. Você pode deletar suas
                  transcrições a qualquer momento.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-zinc-200 mb-2">
                  2.4 Dados de Uso
                </h3>
                <p className="leading-relaxed">
                  Coletamos informações sobre como você usa o serviço, incluindo
                  páginas visitadas, recursos utilizados e tempo de uso.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              3. Como Usamos Suas Informações
            </h2>
            <ul className="list-disc list-inside space-y-2 leading-relaxed">
              <li>Fornecer e manter nosso serviço</li>
              <li>Processar suas transcrições de áudio</li>
              <li>Melhorar e personalizar sua experiência</li>
              <li>Enviar notificações importantes sobre o serviço</li>
              <li>Detectar e prevenir fraudes ou abusos</li>
              <li>Cumprir obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              4. Compartilhamento de Informações
            </h2>
            <p className="leading-relaxed mb-4">
              Não vendemos suas informações pessoais. Podemos compartilhar suas
              informações apenas nas seguintes situações:
            </p>
            <ul className="list-disc list-inside space-y-2 leading-relaxed">
              <li>
                <strong>Provedores de Serviço:</strong> Compartilhamos com
                provedores terceirizados que nos ajudam a operar o serviço
                (Supabase para autenticação, Groq para transcrição).
              </li>
              <li>
                <strong>Requisitos Legais:</strong> Quando exigido por lei ou
                para proteger nossos direitos.
              </li>
              <li>
                <strong>Com Seu Consentimento:</strong> Quando você autorizar
                explicitamente.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              5. Segurança dos Dados
            </h2>
            <p className="leading-relaxed">
              Implementamos medidas de segurança técnicas e organizacionais para
              proteger suas informações, incluindo:
            </p>
            <ul className="list-disc list-inside space-y-2 leading-relaxed mt-4">
              <li>Criptografia de dados em trânsito (HTTPS/TLS)</li>
              <li>Senhas criptografadas com bcrypt</li>
              <li>Autenticação segura via Supabase Auth</li>
              <li>Acesso restrito aos dados</li>
              <li>Monitoramento de segurança contínuo</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              6. Seus Direitos
            </h2>
            <p className="leading-relaxed mb-4">Você tem o direito de:</p>
            <ul className="list-disc list-inside space-y-2 leading-relaxed">
              <li>Acessar suas informações pessoais</li>
              <li>Corrigir informações incorretas</li>
              <li>Deletar sua conta e dados</li>
              <li>Exportar seus dados</li>
              <li>Revogar consentimentos</li>
              <li>Opor-se ao processamento de dados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              7. Cookies e Tecnologias Similares
            </h2>
            <p className="leading-relaxed">
              Usamos cookies essenciais para manter sua sessão de login e
              garantir o funcionamento do serviço. Não usamos cookies de
              rastreamento ou publicidade.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              8. Retenção de Dados
            </h2>
            <p className="leading-relaxed">
              Mantemos suas informações apenas pelo tempo necessário para
              fornecer o serviço. Arquivos de áudio são deletados imediatamente
              após a transcrição. Transcrições são mantidas até você deletá-las
              ou encerrar sua conta.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              9. Menores de Idade
            </h2>
            <p className="leading-relaxed">
              Nosso serviço não é destinado a menores de 18 anos. Não coletamos
              intencionalmente informações de menores. Se você é pai/mãe ou
              responsável e acredita que seu filho forneceu informações, entre
              em contato conosco.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              10. Alterações nesta Política
            </h2>
            <p className="leading-relaxed">
              Podemos atualizar esta Política de Privacidade periodicamente.
              Notificaremos você sobre mudanças significativas por email ou
              através do serviço. A data da última atualização será sempre
              indicada no topo desta página.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              11. Contato
            </h2>
            <p className="leading-relaxed">
              Se você tiver dúvidas sobre esta Política de Privacidade ou sobre
              como tratamos seus dados, entre em contato conosco:
            </p>
            <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
              <p className="text-zinc-300">
                Email:{" "}
                <a
                  href="mailto:privacidade@audiodesc.com"
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  privacidade@audiodesc.com
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
