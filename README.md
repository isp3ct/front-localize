
# Localize - Frontend

Projeto desenvolvido em Next.js para o teste técnico DEV Localize 2025.

## Tecnologias Utilizadas

### Frontend (React + Next.js)
- Next.js 15 com App Router
- React 19 + TypeScript
- Chart.js + react-chartjs-2 (dashboard)
- CSS Modules + TailwindCSS
- ESLint / Prettier
- React Icons

## Funcionalidades

- **Login e Registro de Usuário**
  - Fluxo completo de autenticação.
  - Validação visual e feedback de erros.
  - Autenticação via JWT.

- **Dashboard Visual**
  - Cards de resumo com ícones e dados dinâmicos.
  - Gráfico de pizza interativo mostrando empresas por UF.
  - Animações e legendas interativas.
  - Header e sidebar com design moderno e responsivo.

- **Cadastro de Empresa**
  - Consulta automática de CNPJ via API.
  - Exibição dos dados consultados antes do cadastro.
  - Máscara de CNPJ e validação dos campos obrigatórios.
  - Feedback visual para duplicidade e erros.

- **Listagem de Empresas**
  - Busca, paginação e modal de detalhes animado.
  - Botão de inativação com confirmação.

- **Perfil do Usuário**
  - Edição senha.

- **Logout**
  - Botão com ícone, removendo sessão do usuário.

## Observações Técnicas

- Integração total com backend via fetch, usando `credentials: "include"`.
- CORS e autenticação ajustados para ambiente local.
- Estilização com CSS Modules e ícones do React Icons.
- Responsividade e experiência visual refinada.

## Estrutura de Pastas (Frontend)

```
src/
├── app/
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   ├── company-list/
│   ├── company-create/
│   └── profile/
├── public/
├── globals.css
```


## Configuração da API (Backend)

Antes de rodar o frontend, verifique se a porta e o protocolo (http ou https) da sua API estão corretos no arquivo `.env.local` na raiz do projeto:

```
NEXT_PUBLIC_API_URL_HTTPS=https://localhost:7175
```
- Observação, caso inicie a API em HTTP, altere o port para 5075

Altere conforme a porta e protocolo que sua API estiver rodando.

## Como rodar

```bash
npm install
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000).

## Backend

O backend (API .NET) está em outro repositório, conforme orientações da vaga.
Link para o repositório:
- [Backend LocalizeAPI](https://github.com/isp3ct/localizeBackendAPI)

---

Para dúvidas ou sugestões, consulte o repositório ou entre em contato.