import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { useFavorites } from '@/context/FavoritesContext';
import ErrorState from '@/components/ErrorState';

export default function EditFavoriteScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const { favorites, updateFavorite } = useFavorites();

  const favorite = (favorites ?? []).find((f) => f?.id === id);
  const [nickname, setNickname] = useState(favorite?.nickname ?? '');
  const [notes, setNotes] = useState(favorite?.notes ?? '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (favorite) {
      setNickname(favorite?.nickname ?? '');
      setNotes(favorite?.notes ?? '');
    }
  }, [favorite?.id]);

  const hasChanges =
    nickname !== (favorite?.nickname ?? '') || notes !== (favorite?.notes ?? '');

  const handleSave = useCallback(async () => {
    if (!id || !hasChanges) return;
    try {
      setIsSaving(true);
      await updateFavorite?.(id, { nickname: nickname?.trim?.() ?? '', notes: notes?.trim?.() ?? '' });
      if (Platform.OS === 'web') {
        window?.alert?.('Salvo com sucesso!');
      } else {
        Alert.alert('Sucesso', 'Favorito atualizado!');
      }
      router.back();
    } catch (err) {
      console.error('Error saving favorite:', err);
      if (Platform.OS === 'web') {
        window?.alert?.('Erro ao salvar');
      } else {
        Alert.alert('Erro', 'Não foi possível salvar as alterações.');
      }
    } finally {
      setIsSaving(false);
    }
  }, [id, nickname, notes, hasChanges, updateFavorite]);

  if (!favorite) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Voltar">
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </Pressable>
          <Text style={styles.topTitle}>Editar Favorito</Text>
          <View style={{ width: 60 }} />
        </View>
        <ErrorState message="Favorito não encontrado" />
      </SafeAreaView>
    );
  }

  const displayName = (favorite?.name ?? '').charAt(0).toUpperCase() + (favorite?.name ?? '').slice(1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Voltar">
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </Pressable>
          <Text style={styles.topTitle}>Editar Favorito</Text>
          <Pressable
            onPress={handleSave}
            disabled={!hasChanges || isSaving}
            style={styles.saveBtn}
            accessibilityLabel="Salvar"
          >
            <Text
              style={[
                styles.saveText,
                (!hasChanges || isSaving) && { opacity: 0.4 },
              ]}
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Pokemon preview */}
          <View style={styles.preview}>
            <Image
              source={{ uri: favorite?.imageUrl ?? '' }}
              style={styles.previewImage}
              resizeMode="contain"
              accessibilityLabel={displayName}
            />
            <Text style={styles.previewName}>{displayName}</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Apelido</Text>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={(t) => setNickname((t ?? '').slice(0, 20))}
              placeholder="Ex: Pikachu Fofão"
              placeholderTextColor={COLORS.textSecondary}
              maxLength={20}
              accessibilityLabel="Apelido do Pokémon"
            />
            <Text style={styles.charCount}>{nickname?.length ?? 0}/20</Text>

            <Text style={[styles.label, { marginTop: SPACING.lg }]}>Notas</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={(t) => setNotes((t ?? '').slice(0, 200))}
              placeholder="Adicione suas notas..."
              placeholderTextColor={COLORS.textSecondary}
              maxLength={200}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              accessibilityLabel="Notas sobre o Pokémon"
            />
            <Text style={styles.charCount}>{notes?.length ?? 0}/200</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  backBtn: {
    padding: 8,
  },
  topTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  saveBtn: {
    padding: 8,
    minWidth: 60,
    alignItems: 'flex-end',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 48,
  },
  preview: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  previewImage: {
    width: 80,
    height: 80,
  },
  previewName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  form: {
    marginTop: SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.surface,
  },
  notesInput: {
    minHeight: 100,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
});
