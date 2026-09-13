import type { AppData, AppSettings } from "../types/app-data";
import { uniqueVocabulary } from "./vocabulary.ts";

export type SettingsMutator = (settings: AppSettings) => AppSettings;

export function normalizeSettings(settings: AppSettings): AppSettings {
  const maxPanelWidth = Number.isFinite(settings.maxPanelWidth) ? settings.maxPanelWidth : 350;

  return {
    ...settings,
    title: settings.title.trim() || "作业",
    subjects: uniqueVocabulary(settings.subjects),
    tags: uniqueVocabulary(settings.tags),
    maxPanelWidth: Math.round(Math.max(160, Math.min(2000, maxPanelWidth)) / 10) * 10,
    backgroundOpacity: normalizeBackgroundOpacity(settings.backgroundOpacity),
    homeworkScale: normalizeHomeworkScale(settings.homeworkScale),
  };
}

export function normalizeBackgroundOpacity(value: number): number {
  const opacity = Number.isFinite(value) ? value : 100;
  return Math.round(Math.max(0, Math.min(100, opacity)));
}
export function normalizeHomeworkScale(value: number): number {
  const scale = Number.isFinite(value) ? value : 100;
  return Math.round(Math.max(75, Math.min(200, scale)) / 5) * 5;
}

export function updateAppSettings(data: AppData, mutate: SettingsMutator): AppData {
  return { ...data, settings: normalizeSettings(mutate(data.settings)) };
}

export function removeGlobalTag(data: AppData, tag: string): AppData {
  return {
    ...data,
    homeworks: data.homeworks.map((homework) => ({
      ...homework,
      tags: homework.tags.filter((homeworkTag) => homeworkTag !== tag),
    })),
    settings: {
      ...data.settings,
      tags: data.settings.tags.filter((settingTag) => settingTag !== tag),
    },
  };
}
