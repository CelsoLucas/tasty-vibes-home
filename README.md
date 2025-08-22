# Tasty - Aplicativo Mobile de Avaliações de Restaurantes

Este é um aplicativo móvel desenvolvido com Expo e React Native para avaliações de restaurantes.

## 🚀 Como executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- Expo CLI (`npm install -g @expo/cli`)
- Dispositivo móvel com o app Expo Go instalado OU emulador Android/iOS

### Configuração

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env`
   - Adicione suas credenciais do Supabase

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

5. Use o Expo Go no seu dispositivo para escanear o QR code ou execute em um emulador

## 📱 Funcionalidades

- **Autenticação**: Login, registro e recuperação de senha
- **Home**: Lista de restaurantes organizados por categorias
- **Busca**: Pesquisa de restaurantes por nome ou categoria
- **Avaliações**: Adicionar avaliações com fotos e comentários
- **Perfil**: Gerenciar perfil do usuário e visualizar avaliações

## 🛠 Tecnologias

- **Expo**: Framework para desenvolvimento React Native
- **React Native**: Framework para aplicativos móveis
- **NativeWind**: Tailwind CSS para React Native
- **Supabase**: Backend como serviço (autenticação e banco de dados)
- **React Query**: Gerenciamento de estado e cache
- **Expo Router**: Navegação baseada em arquivos

## 📁 Estrutura do Projeto

```
app/
├── (auth)/          # Telas de autenticação
├── (tabs)/          # Telas principais com navegação por abas
├── _layout.tsx      # Layout raiz
└── index.tsx        # Tela inicial

lib/
└── supabase.ts      # Configuração do Supabase

hooks/
└── useRestaurants.ts # Hooks personalizados
```

## 🔧 Desenvolvimento

Para adicionar novas telas, crie arquivos na pasta `app/` seguindo a convenção do Expo Router.

Para estilização, use as classes do Tailwind CSS com NativeWind.

## 📦 Build

Para gerar builds de produção:

```bash
# Android
expo build:android

# iOS
expo build:ios
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request