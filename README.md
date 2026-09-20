# 🗺️ Georreferenciamento de Sinalização de Trânsito

Aplicação Web para **consulta, visualização e gerenciamento de sinalizações verticais de trânsito de Quixadá**, desenvolvida para a Secretaria de Trânsito de Quixadá.

Projeto desenvolvido na disciplina **Projeto Social — Sistemas de Informação — UFC Quixadá**.

## 🚀 Tecnologias

* React
* TypeScript
* Vite
* Material UI
* Tailwind CSS
* React Router
* Axios
* React Hook Form
* Zod
* Vitest

## 📁 Estrutura

```text
src/
├── assets/
├── components/
├── pages/
├── services/
├── repositories/
├── hooks/
├── contexts/
├── routes/
├── types/
├── utils/
├── lib/
├── App.tsx
├── main.tsx
└── index.css
```

## 🏗️ Arquitetura

```text
Page
 ↓
Service
 ↓
Repository
 ↓
API
```

* **Pages:** telas e composição da interface.
* **Components:** componentes reutilizáveis.
* **Services:** regras e operações da aplicação.
* **Repositories:** acesso aos dados/API.
* **Hooks:** hooks reutilizáveis do React.
* **Contexts:** estados globais.
* **Routes:** navegação e controle de acesso.
* **Types:** tipagens compartilhadas.
* **Utils:** funções auxiliares.
* **Theme:** configuração visual do MUI.
* **Lib:** configurações de bibliotecas.

## ▶️ Como rodar o projeto

### 1. Clone o repositório

```bash
git clone <https://github.com/SabrinaDamascenoDev/ProjetoSocialFrontend.git>
cd <ProjetoSocialFrontend>
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

### 4. Execute o projeto

```bash
npm run dev
```

O projeto estará disponível no endereço informado pelo Vite, normalmente:

```text
http://localhost:5173
```

### 5. Build para produção

```bash
npm run build
```

### 6. Executar os testes

```bash
npm run test
```

## 🎯 Objetivo

Substituir o processo manual de mapeamento de sinalizações por uma solução padronizada, permitindo o gerenciamento dos registros, visualização em mapa e geração de relatórios.

## 📌 Escopo

O sistema é destinado a **agentes de trânsito e usuários autorizados da Secretaria de Trânsito de Quixadá**, não sendo disponibilizado ao público geral.
