import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ComponentTopic = {
  title: string;
  description: string;
};

type ComponentSection = {
  title: string;
  data: ComponentTopic[];
};

const componentSections: ComponentSection[] = [
  {
    title: 'Lists',
    data: [
      {
        title: 'SectionList',
        description:
          'Groups scrollable rows into sections. It is best for lists that need section headers.',
      },
    ],
  },
  {
    title: 'Overlays',
    data: [
      {
        title: 'Modal',
        description:
          'Displays a screen on top of the app. It can contain custom content and is closed with state.',
      },
      {
        title: 'Alert',
        description:
          'Shows a native confirmation or information dialog. Use it for brief user decisions.',
      },
    ],
  },
  {
    title: 'Loading',
    data: [
      {
        title: 'ActivityIndicator',
        description:
          'Displays a native spinning indicator while an asynchronous task is in progress.',
      },
    ],
  },
];

function ComponentModal({
  topic,
  onClose,
}: {
  topic: ComponentTopic | null;
  onClose: () => void;
}) {
  const theme = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent
      visible={topic !== null}
      onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.modalCard,
            { backgroundColor: theme.background, borderColor: theme.backgroundSelected },
          ]}
          onPress={() => undefined}>
          {topic && (
            <>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                {topic.title}
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.modalDescription}>
                {topic.description}
              </ThemedText>
            </>
          )}
          <Pressable
            accessibilityRole="button"
            style={[styles.primaryButton, { backgroundColor: theme.text }]}
            onPress={onClose}>
            <ThemedText
              style={[styles.primaryButtonText, { color: theme.background }]}>
              Close
            </ThemedText>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const [selectedTopic, setSelectedTopic] = useState<ComponentTopic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const refreshDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Demo complete', 'The ActivityIndicator finished loading.');
    }, 1200);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <SectionList
          sections={componentSections}
          keyExtractor={(item) => item.title}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled
          ListHeaderComponent={
            <View style={styles.header}>
              <ThemedText type="title" style={styles.title}>
                Components
              </ThemedText>
              <ThemedText themeColor="textSecondary">
                Tap a topic to open it in a Modal. Use the button to try a loading state.
              </ThemedText>
              <Pressable
                accessibilityRole="button"
                style={[
                  styles.primaryButton,
                  styles.refreshButton,
                  { backgroundColor: theme.text },
                ]}
                onPress={refreshDemo}>
                {isLoading ? (
                  <ActivityIndicator color={theme.background} />
                ) : (
                  <ThemedText
                    style={[styles.primaryButtonText, { color: theme.background }]}>
                    Run loading demo
                  </ThemedText>
                )}
              </Pressable>
            </View>
          }
          renderSectionHeader={({ section }) => (
            <ThemedView
              style={[
                styles.sectionHeader,
                { borderBottomColor: theme.backgroundSelected },
              ]}>
              <ThemedText type="smallBold">{section.title}</ThemedText>
            </ThemedView>
          )}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.topicCard,
                {
                  backgroundColor: theme.backgroundElement,
                  opacity: pressed ? 0.72 : 1,
                },
              ]}
              onPress={() => setSelectedTopic(item)}>
              <ThemedText type="default">{item.title}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.topicDescription}>
                {item.description}
              </ThemedText>
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />

        {isLoading && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <View
              style={[
                styles.loadingCard,
                { backgroundColor: theme.backgroundElement },
              ]}>
              <ActivityIndicator size="large" color={theme.text} />
              <ThemedText type="small">Loading components...</ThemedText>
            </View>
          </View>
        )}

        <ComponentModal topic={selectedTopic} onClose={() => setSelectedTopic(null)} />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  listContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.six,
  },
  header: {
    gap: Spacing.three,
    paddingTop: Spacing.six,
    paddingBottom: Spacing.four,
  },
  title: {
    fontSize: Platform.select({ web: 48, default: 40 }),
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButton: {
    width: '100%',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionHeader: {
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topicCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  topicDescription: {
    lineHeight: 20,
  },
  separator: {
    height: Spacing.two,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderRadius: Spacing.four,
    margin: Spacing.three,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  modalTitle: {
    fontSize: 32,
  },
  modalDescription: {
    lineHeight: 24,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingCard: {
    minWidth: 180,
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Spacing.three,
    padding: Spacing.four,
  },
});
