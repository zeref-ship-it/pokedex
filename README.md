Markdown# 📱 Pokédex — React Native + Firebase

Aplicativo móvel de Pokédex desenvolvido com **React Native** e **Expo**, consumindo a **PokéAPI** e integrando o **Firebase Firestore** para a persistência e gerenciamento de Pokémons favoritos.

Este projeto foi desenvolvido para a **Disciplina de Desenvolvimento Mobile**.

---

## 🚀 Funcionalidades

* 🔍 **Lista de Pokémons:** Exibição em grid com paginação via *scroll* infinito.
* 🔎 **Busca Inteligente:** Filtragem por nome ou ID do Pokémon.
* 📋 **Tela de Detalhes:** Visualização de estatísticas base, habilidades, altura, peso e tipo.
* ⭐ **Sistema de Favoritos (CRUD completo):**
    * **Criar:** Salvar um Pokémon na nuvem (Firebase).
    * **Ler:** Listar os Pokémons favoritados em tempo real.
    * **Atualizar:** Definir e editar um apelido personalizado para o Pokémon.
    * **Excluir:** Remover o Pokémon da lista de favoritos com confirmação.
* 🎨 **Interface Animada:** Transições fluidas, efeitos de pulso e barras de status animadas.

---

## 🛠️ Tecnologias e Dependências

| Tecnologia / Biblioteca | Uso no Projeto |
| :--- | :--- |
| **React Native + Expo** | Estrutura base e ambiente de desenvolvimento do app. |
| **React Navigation** | Navegação entre telas (Abas e Pilha). |
| **PokéAPI** | Fonte de dados externa para as informações dos Pokémons. |
| **Firebase Firestore** | Banco de dados NoSQL para o CRUD de favoritos. |
| **Animated API (Native)** | Criação de animações nativas na interface. |
| **@expo/vector-icons** | Ícones utilizados na interface do usuário. |

---

## 📁 Estrutura de Pastas

```text
pokedex/
├── App.js
├── firebaseConfig.js
├── package.json
├── index.js
├── assets/
└── src/
    ├── screens/
    │   ├── HomeScreen.js
    │   ├── DetailScreen.js
    │   └── FavoritesScreen.js
    ├── services/
    │   ├── pokeapi.js
    │   └── firebase.js
    └── utils/
        └── typeColors.js
⚙️ Como Instalar e RodarPré-requisitosNode.js (Versão LTS recomendada)Aplicativo Expo Go instalado no seu celular (Android ou iOS)1. Criar o projeto baseBashnpx create-expo-app pokedex --template blank
cd pokedex
2. Instalar as dependências do projetoBashnpx expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack react-native-screens react-native-safe-area-context @expo/vector-icons firebase
3. Configurar o FirebaseAcesse o Console do Firebase.Crie um novo projeto e ative o Firestore Database em Modo de Teste.Registre um aplicativo do tipo Web e copie as credenciais geradas.Crie o arquivo firebaseConfig.js na raiz do projeto e cole o código abaixo com os seus dados:JavaScriptimport { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJECT.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
4. Rodar o projetoBashnpx expo start

Abra o aplicativo Expo Go no celular e escaneie o QR Code que aparecerá no terminal ou no navegador.
📋 Requisitos Técnicos AtendidosRequisitoStatusDetalhesNavegação (3+ telas)✅Combinação de Tab Navigation (Abas inferiores) + Stack Navigation (Pilha de telas).

Consumo de API Externa
✅Integração completa com a PokéAPI para listagem, busca e detalhes.CRUD com Firebase

✅Implementação de Criar, Ler, Atualizar (Apelido) e Deletar dados no Firestore.Animações Fluidas

✅Uso de efeitos como Spring (mola), Fade (opacidade), Slide, barras de progresso e efeito Pulse.

📱 Telas do Aplicativo
🏠 Home (Início)Exibição dos Pokémons em formato de Grid com carregamento sob demanda (scroll infinito).Barra de pesquisa funcional por nome ou número do ID.Cartões renderizados dinamicamente com cores baseadas no tipo principal do Pokémon e animação de entrada.

🔍 DetalhesImagem do Pokémon renderizada com uma animação de mola (Spring).Estatísticas de combate exibidas através de barras animadas.Botão de favoritar com efeito visual de pulsação (Pulse).Janela flutuante (Modal) intuitiva para adicionar ou editar o apelido do Pokémon.

⭐ FavoritosLista dedicada aos Pokémons salvos no banco de dados.Exibição em destaque do apelido personalizado escolhido pelo usuário.Botão rápido de remoção direta acompanhado de uma caixa de confirmação.Animação suave de entrada ao carregar os cartões.


🔥 Operações do CRUD (Firebase Firestore)OperaçãoTela de OrigemMétodo / AçãoCriar (Create)Tela de DetalhesaddFavorite() — Salva o Pokémon e o apelido inicial.Ler (Read)Tela de FavoritosgetFavorites() — Monitora e lista os dados em tempo real.Atualizar (Update)Tela de Detalhes (Modal)updateApelido() — Modifica o apelido salvo no banco.Excluir (Delete)Tela de FavoritosremoveFavorite() — Remove o registro do Firestore.

⚠️ Resolução de Problemas Comuns


💡 Erro: "Não foi possível resolver o módulo..."Solução: Certifique-se de que todas as dependências foram instaladas. Pare o terminal e execute npx expo install novamente.

💡 Erro: O aplicativo não conecta ao FirebaseSolução: Verifique se as chaves e IDs copiados no arquivo firebaseConfig.js estão exatamente iguais aos fornecidos pelo console do Firebase.

💡 Erro: O QR Code não funciona ou não carrega no celularSolução: Garanta que o seu computador e o seu celular estejam conectados exatamente na mesma rede Wi-Fi. Se o erro persistir, tente iniciar o projeto com npx expo start --tunnel.

💡 Erro: Tela Branca ao abrir o appSolução: Verifique o terminal para identificar erros de sintaxe e certifique-se de que todos os arquivos da Estrutura de Pastas foram criados nos locais corretos.