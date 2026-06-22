# UX Specification — Pokédex App

## Design Direction

### Color Palette
- **Primary**: Pokémon Red `#DC2626`
- **Accent**: Pokémon Gold `#FACC15`
- **Background Dark**: `#0F0F0F`
- **Surface**: `#1A1A1A`
- **Surface Elevated**: `#242424`
- **Text Primary**: `#F5F5F5`
- **Text Secondary**: `#A3A3A3`
- **Error**: `#EF4444`
- **Success**: `#22C55E`

### Type Color Map
| Type | Color |
|------|-------|
| fire | #F97316 |
| water | #3B82F6 |
| grass | #22C55E |
| electric | #FACC15 |
| psychic | #EC4899 |
| ice | #67E8F9 |
| dragon | #7C3AED |
| dark | #57534E |
| fairy | #F9A8D4 |
| normal | #A8A29E |
| fighting | #B91C1C |
| flying | #93C5FD |
| poison | #A855F7 |
| ground | #D97706 |
| rock | #A3A3A3 |
| bug | #84CC16 |
| ghost | #7C3AED |
| steel | #94A3B8 |

### Typography
- **Display**: `Poppins` 700 — 32px (screen titles)
- **Heading**: `Poppins` 600 — 22px (section headers)
- **Subheading**: `Poppins` 600 — 18px
- **Body**: `Poppins` 400 — 16px
- **Caption**: `Poppins` 400 — 13px
- Load via `expo-font` / Google Fonts

### Spacing & Radii
- 8pt grid throughout
- Card radius: 16px
- Badge radius: 12px
- Button radius: 12px
- Screen horizontal padding: 16px

---

## Screens

### 1. Home Screen (`tabs/index.tsx`)
**Purpose**: Browse all Pokémon with infinite scroll and search.

**Layout (top to bottom)**:
1. **Header area**: App title "Pokédex" in Display font, centered, with a small Pokéball icon to the left.
2. **Search bar**: Rounded input with magnifying glass icon on the left, placeholder "Buscar Pokémon...". Floating label not needed — simple placeholder. Filters locally on the already-fetched list by name. Debounced 300ms.
3. **Pokémon grid**: 2-column grid of cards. Each card:
   - Pokémon sprite image (from `sprites.other['official-artwork'].front_default`, fallback to `sprites.front_default`) — centered, 96×96
   - Pokémon number `#001` in Caption, text secondary color, top-right of card
   - Pokémon name capitalized, Body font, white
   - Row of type badges below name — each badge is a small rounded pill with the type color background and white text (Caption size)
   - Card background: `Surface Elevated` with subtle gradient tint based on the Pokémon's primary type color at 15% opacity
   - On press → push to Detail screen with `pokemonId` param
4. **Infinite scroll**: fetch 20 Pokémon per page from PokeAPI. On reaching end, fetch next page. Show a small loading indicator at the bottom while fetching.
5. **Loading state (initial)**: 6 skeleton cards shimmer in the grid.
6. **Error state**: Centered illustration-free message "Erro ao carregar Pokémon" with a "Tentar novamente" button.
7. **Empty search state**: "Nenhum Pokémon encontrado" centered text.

**Animations**:
- Cards: staggered fade-in + translateY(20→0) on mount using `react-native-reanimated` `FadeInDown` with 50ms delay per index (capped at 6).
- Search bar: subtle scale on focus.

---

### 2. Detail Screen (`pokemon/[id]/index.tsx`)
**Purpose**: Show full details of a Pokémon and allow favoriting.

**Layout (top to bottom, scrollable)**:
1. **Header**: Back arrow (left), Pokémon name (center), Heart icon button (right). Heart is filled red if favorited, outlined if not. Tapping heart toggles favorite status in Firestore.
2. **Hero section**: Large Pokémon artwork (200×200) centered on a gradient background derived from the primary type color. Parallax-style: image slightly translates on scroll.
3. **Number & Name**: `#025` in Caption + name in Heading, centered below hero.
4. **Type badges row**: Same pill badges as Home, centered.
5. **Physical info row**: Two cards side by side:
   - "Peso" — value in kg (hectograms / 10)
   - "Altura" — value in m (decimetres / 10)
6. **Base Stats section**: Section title "Estatísticas Base". For each stat (HP, Ataque, Defesa, Ataque Esp., Defesa Esp., Velocidade):
   - Stat name (Caption) | numeric value | horizontal progress bar (animated fill from 0 to value/255, colored by stat type: HP=green, Attack=red, Defense=orange, SpAtk=blue, SpDef=purple, Speed=yellow)
   - Bars animate on screen mount with `withTiming` 800ms.
7. **Abilities section**: Section title "Habilidades". List of ability names as chips/pills. Capitalize first letter.
8. **Favorite action**: If NOT favorited, a full-width gradient button "Adicionar aos Favoritos" at the bottom. If favorited, show "Remover dos Favoritos" as an outlined red button.

**Animations**:
- Heart icon: on tap, scale 1→1.4→1 spring animation + color transition. Use `react-native-reanimated` `withSpring`.
- Stat bars: animated width from 0% to target% on mount.
- Hero image: subtle `FadeIn` + scale 0.9→1.

---

### 3. Favorites Screen (`tabs/favorites.tsx`)
**Purpose**: View and manage favorited Pokémon stored in Firestore.

**Layout (top to bottom)**:
1. **Header**: "Meus Favoritos" in Display font.
2. **Favorites list**: Vertical list of cards. Each card:
   - Pokémon image (64×64) on the left
   - Name + nickname (if set, shown as "Name • Apelido") in Body font
   - Type badges row
   - Notes preview (if set, 1 line truncated) in Caption, text secondary
   - Swipe left to reveal delete action (red background with trash icon) OR long-press to show delete confirmation
   - Tap card → push to Detail screen for that Pokémon
   - Edit icon button (pencil) on the right → push to Edit Favorite screen
3. **Empty state**: Centered Pokéball outline icon + "Nenhum favorito ainda" + "Explore a Pokédex e adicione seus Pokémon favoritos!" in text secondary.
4. **Loading state**: 3 skeleton cards.

**Animations**:
- Cards: staggered `FadeInRight` on mount.
- Delete: card slides out left with `FadeOutLeft`.

---

### 4. Edit Favorite Screen (`favorite/[id]/edit.tsx`)
**Purpose**: Edit nickname and notes for a favorited Pokémon.

**Layout**:
1. **Header**: Back arrow (left), "Editar Favorito" (center), "Salvar" text button (right, primary color, disabled until changes made).
2. **Pokémon preview**: Small image (80×80) + name centered. Non-editable.
3. **Form**:
   - "Apelido" text input, floating label, max 20 chars. Pre-filled if exists.
   - "Notas" multiline text input, floating label, max 200 chars. Pre-filled if exists.
4. **Save**: Tapping "Salvar" updates Firestore document, shows brief success toast, then pops back.
5. **Validation**: No required fields (both optional). Just max length.

---

## Navigation

### Structure
```
app/
  _layout.tsx          → Root Stack navigator (loads fonts, provides FavoritesProvider context)
  tabs/
    _layout.tsx        → Bottom Tab navigator with 2 tabs
    index.tsx          → Home (tab: "Pokédex", icon: list)
    favorites.tsx      → Favorites (tab: "Favoritos", icon: heart)
  pokemon/
    [id]/
      index.tsx        → Pokemon Detail screen
  favorite/
    [id]/
      edit.tsx         → Edit Favorite screen
```

### Navigation Flows
- **Tab bar**: 2 tabs — "Pokédex" (home icon or list icon) and "Favoritos" (heart icon). Active tab uses Primary Red color. Inactive uses text secondary.
- **Home → Detail**: Tap a Pokémon card → stack push `pokemon/[id]` with slide-from-right transition.
- **Favorites → Detail**: Tap a favorite card → stack push `pokemon/[id]`.
- **Favorites → Edit**: Tap edit icon on a favorite card → stack push `favorite/[id]/edit`.
- **Detail → back**: Back arrow or swipe-back gesture → pop.
- **Edit → back**: Back arrow → pop (discard changes). "Salvar" → save + pop.

### No Auth
This app has no authentication. All screens are immediately accessible. Firestore rules should be set to allow read/write (development mode) or use anonymous auth if needed — but the app itself has no login screen.

---

## State Management

### FavoritesContext
A React Context + hooks pattern:
- `favorites: FavoritePokemon[]` — current list from Firestore
- `isLoading: boolean`
- `isFavorite(pokemonId: number): boolean`
- `addFavorite(pokemon: {...}): Promise<void>`
- `removeFavorite(firestoreDocId: string): Promise<void>`
- `updateFavorite(firestoreDocId: string, data: {nickname?, notes?}): Promise<void>`

The context subscribes to Firestore collection `favorites` with `onSnapshot` for real-time updates.

---

## Animation & Motion Summary
| Element | Animation | Library |
|---------|-----------|---------|
| Card entry (Home) | Staggered FadeInDown | reanimated |
| Card entry (Favorites) | Staggered FadeInRight | reanimated |
| Heart icon toggle | Scale spring 1→1.4→1 + color | reanimated |
| Stat bars | Width 0→target with timing 800ms | reanimated |
| Hero image | FadeIn + scale 0.9→1 | reanimated |
| Card delete | FadeOutLeft | reanimated |
| Loading | Skeleton shimmer | custom reanimated |
| Screen transitions | Default stack slide | expo-router |
| Search focus | Subtle scale | reanimated |

---

## Component Standards
- **PokemonCard**: Used in Home grid. Image, name, number, type badges. Press animation scale 0.97 spring.
- **FavoriteCard**: Used in Favorites list. Image, name, nickname, notes preview, type badges, edit button. Swipe-to-delete.
- **TypeBadge**: Pill component. Takes type string, renders with correct background color from type map + white text.
- **StatBar**: Animated horizontal bar. Takes label, value (0-255), color.
- **SkeletonCard**: Shimmer placeholder matching PokemonCard dimensions.
- **SearchBar**: Rounded input with icon.
- **GradientButton**: Full-width button with `LinearGradient` [Primary, Accent] background.
- **ErrorState**: Centered error message + retry button.
- **EmptyState**: Centered icon + message + optional sub-message.

## Accessibility
- All images have `accessibilityLabel` with Pokémon name
- Touch targets minimum 44pt
- Type badges have accessible labels
- Contrast ratios maintained (white text on colored badges verified ≥ 4.5:1 — for light colors like electric/yellow, use dark text instead)
