# 📱 Pokédex — React Native + Firebase

Aplicativo móvel de Pokédex desenvolvido com **React Native + Expo** , consumindo a **PokéAPI** e integrando **Firebase Firestore** para persistência de favoritos.

---

## 🚀 Funcionalidades

- 🔍 **Listagem** de Pokémons com scroll infinito
 - 🔎 **Busca** por nome ou ID
 - 📋 **Tela de Detalhes** com estatísticas, habilidades, altura e peso
 - ⭐ **Favoritar** Pokémons (salvo no Firebase)
 - ✏️ **Apelido** personalizável para cada favorito (Update)
 - 🗑️ **Remover** favoritos (Delete)
 - 🎨 **Animações** em toda a interface

---

## 🛠️ Tecnologias
Tecnologia	Uso
React Native + Expo	Base do app
Navegação React	Navegação entre telas
PokeAPI	Dados dos Pokémons
Firebase Firestore	Persistência emc (CRUD)
API animada	Animações nativas
@expo/ícones-vetoriais	Ícones
📁 Estrutura de Pastas
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
⚙️ Como Instalar e Rodar
Pré-requisitos
Node.js LTS
App Expo Go no celular ( Android / iOS )
1. Crie o projeto base
bash
Cópia
npx create-expo-app pokedex --template blank
 cd pokedex
2. Instale as responsabilidades
bash
Cópia
npx expo install @react-navigation/native @react-navigation/bottom-tabs \
  @react-navigation/native-stack react-native-screens \
  react-native-safe-area-context @expo/vector-icons firebase
3. Configure o Firebase
Acesse console.firebase.google.com
Crie um projeto e ative o Firestore Database em modo de teste
Registre um aplicativo Web e copie as credenciais
Cole em firebaseConfig.js:
js
Cópia
const firebaseConfig = {
   apiKey : "SUA_API_KEY" ,
   authDomain : "SEU_PROJECT.firebaseapp.com" ,
   projectId : "SEU_PROJECT_ID" ,
   storageBucket : "SEU_PROJECT.appspot.com" ,
   messagesSenderId : "SEU_SENDER_ID" ,
   appId : "SEU_APP_ID" ,
};
4. Rode o projeto
bash
Cópia
npx expo iniciar
Escaneie o QR Code com o Expo Go no celular. 📱

📋 Requisitos Técnicos Atendidos
Requisito	Status	Detalhes
Navegação (3+ telas)	✅	Navegação por abas + Navegação em pilha
Consumo de API externo	✅	PokeAPI (lista, busca, detalhes)
CRUD com Firebase	✅	Criar, Ler, Atualizar (apelido), Excluir
Animações	✅	Spring, fade, slide, barras de estado, pulso
📱 Telas
🏠 Lar
Lista de Pokémons em grid com scroll infinito
Busca por nome ou ID
Cartões coloridos por tipo com animação de entrada
🔍 Detalhes
Imagem com animação primavera
Estatísticas com barras animadas
Botão de favoritar com efeito pulse
Modal para editar apelido
⭐ Favoritos
Lista de Pokémons favoritos
Exiba apelido personalizado
Botão de remoção com confirmação
Animação de entrada nos cartões
🔥 CRUD Firebase — Coleçãofavoritos
Operação	Onde	Método
Criar	Tela de Detalhes → ⭐	addFavorite()
Ler	Tela de Favoritos	getFavorites()
Atualizar	Tela de Detalhes → ✏️	updateApelido()
Excluir	Tela de Favoritos → 🗑️	removeFavorite()
⚠️ Problemas Comuns
Problema	…
Unable to resolve module	Rode npx expo installnovamente
Aplicativo não é ao Firebase	Verifique as credenciais nãofirebaseConfig.js
O código QR não funciona	Celular e PC devem estar na mesma rede Wi-Fi
Tela branca	Verifique se todos os arquivos foram criados corretamente
👨‍💻 Desenvolvido para
Disciplina de Desenvolvimento Mobile — React Native
Tema: Pokédex Interativa com Firebase