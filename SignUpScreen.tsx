import React, { useState } from 'react';

interface SignUpScreenProps {
  onSignUp: (formData: any) => void;
  onSwitchToLogin: () => void;
}

const TermsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Termos e Condições de Uso - TeraClinic</h2>
            <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
                <p>Bem-vindo ao TeraClinic. Ao acessar e utilizar este software, você concorda em cumprir e estar vinculado aos seguintes termos e condições. Por favor, leia-os com atenção.</p>
                
                <h3 className="font-semibold text-base pt-2">1. Aceitação dos Termos</h3>
                <p>Ao criar uma conta ou utilizar o TeraClinic, você confirma que leu, entendeu e concorda em estar vinculado a estes Termos, bem como à nossa Política de Privacidade. Se você não concordar com estes termos, não deverá utilizar o serviço.</p>

                <h3 className="font-semibold text-base pt-2">2. Descrição do Serviço</h3>
                <p>O TeraClinic é uma plataforma de software como serviço (SaaS) projetada para auxiliar clínicas terapêuticas na gestão de pacientes, agendamentos, registros de evolução, comunicação interna e controle financeiro. A ferramenta de geração de evolução com Inteligência Artificial (IA) é um recurso auxiliar e não substitui o julgamento clínico profissional.</p>

                <h3 className="font-semibold text-base pt-2">3. Responsabilidades do Usuário</h3>
                <p><strong>Confidencialidade da Conta:</strong> Você é responsável por manter a confidencialidade de sua senha e conta e por todas as atividades que ocorram sob sua conta. Você concorda em notificar imediatamente o TeraClinic sobre qualquer uso não autorizado de sua conta.</p>
                <p><strong>Uso Ético e Legal:</strong> Você concorda em usar o TeraClinic para fins legais e éticos, em conformidade com todas as leis aplicáveis, incluindo, mas não se limitando à Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e às regulamentações do seu conselho profissional.</p>
                <p><strong>Precisão das Informações:</strong> Você é o único responsável pela precisão, qualidade, integridade e legalidade de todos os dados inseridos na plataforma, incluindo informações de pacientes e registros financeiros.</p>

                <h3 className="font-semibold text-base pt-2">4. Proteção de Dados e Privacidade</h3>
                <p>O TeraClinic está comprometido com a proteção dos seus dados e dos dados de seus pacientes. Todas as informações são armazenadas em ambientes seguros. O acesso aos dados é restrito e controlado. Ao utilizar o serviço, você concede ao TeraClinic o direito de processar seus dados conforme necessário para fornecer, manter e melhorar o serviço, sempre em conformidade com a LGPD. Não compartilharemos dados sensíveis de pacientes com terceiros, exceto quando exigido por lei.</p>

                <h3 className="font-semibold text-base pt-2">5. Limitação de Responsabilidade</h3>
                <p>O TeraClinic é fornecido "como está". Não garantimos que o serviço será ininterrupto ou livre de erros. Em nenhuma circunstância o TeraClinic será responsável por quaisquer danos diretos, indiretos, incidentais ou consequenciais resultantes do uso ou da incapacidade de usar o serviço. O uso da funcionalidade de IA é por sua conta e risco; os profissionais são responsáveis por revisar e validar todo o conteúdo gerado antes de salvá-lo como um registro oficial.</p>

                <h3 className="font-semibold text-base pt-2">6. Modificações nos Termos</h3>
                <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Notificaremos sobre alterações significativas. O uso continuado do serviço após tais alterações constituirá seu consentimento para com as novas condições.</p>
            </div>
            <div className="flex justify-end mt-6">
                <button onClick={onClose} className="px-4 py-2 text-white bg-green-500 rounded-md">Entendi e Aceito</button>
            </div>
        </div>
    </div>
);

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onSwitchToLogin }) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      cpf: '',
      dateOfBirth: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
        setError('Você deve aceitar os Termos e Condições para continuar.');
        return;
    }
    if (formData.password !== formData.confirmPassword) {
        setError('As senhas não coincidem.');
        return;
    }
    setError('');
    onSignUp(formData);
  };

  return (
    <>
    {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-green-600">Crie sua Conta</h1>
            <p className="mt-2 text-gray-500">Comece a gerenciar sua clínica com TeraClinic.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                    <input name="name" type="text" value={formData.name} onChange={handleChange} required className="w-full p-2 mt-1 bg-white border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full p-2 mt-1 bg-white border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">CPF</label>
                    <input name="cpf" type="text" value={formData.cpf} onChange={handleChange} required className="w-full p-2 mt-1 bg-white border rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                    <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required className="w-full p-2 mt-1 bg-white border rounded-md"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Senha</label>
                    <input name="password" type="password" value={formData.password} onChange={handleChange} required className="w-full p-2 mt-1 bg-white border rounded-md"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
                    <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="w-full p-2 mt-1 bg-white border rounded-md"/>
                </div>
                <hr className="my-2 md:col-span-2"/>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Nome da Empresa/Clínica</label>
                    <input name="companyName" type="text" value={formData.companyName} onChange={handleChange} required className="w-full p-2 mt-1 bg-white border rounded-md"/>
                </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Endereço</label>
                    <input name="address" type="text" value={formData.address} onChange={handleChange} required className="w-full p-2 mt-1 bg-white border rounded-md"/>
                </div>
            </div>

            <div className="flex items-center pt-2">
                <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                    Eu li e concordo com os{' '}
                    <button type="button" onClick={() => setShowTermsModal(true)} className="font-medium text-green-600 hover:underline">
                        Termos e Condições
                    </button>
                </label>
           </div>
           
           {error && <p className="text-sm text-center text-red-500">{error}</p>}

          <div>
            <button type="submit" disabled={!agreedToTerms} className="w-full px-4 py-2 mt-2 font-semibold text-white transition-colors bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
              Cadastrar
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
            Já tem uma conta?{' '}
            <button onClick={onSwitchToLogin} className="font-medium text-green-600 hover:text-green-500">
                Faça login
            </button>
        </p>
      </div>
    </div>
    </>
  );
};

export default SignUpScreen;