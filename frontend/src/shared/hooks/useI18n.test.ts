import { renderHook, act } from '@testing-library/react';
import { useI18n } from './useI18n';

describe('useI18n', () => {
  it('should return default language (es)', () => {
    const { result } = renderHook(() => useI18n());
    expect(result.current.language).toBe('es');
  });

  it('should translate keys correctly', () => {
    const { result } = renderHook(() => useI18n());
    expect(result.current.t('common.loading')).toBe('Cargando...');
    expect(result.current.t('dashboard.title')).toBe('Panel de Control');
  });

  it('should change language', () => {
    const { result } = renderHook(() => useI18n());

    act(() => {
      result.current.changeLanguage('en');
    });

    expect(result.current.language).toBe('en');
    expect(result.current.t('common.loading')).toBe('Loading...');
  });

  it('should return key if translation not found', () => {
    const { result } = renderHook(() => useI18n());
    expect(result.current.t('non.existent.key')).toBe('non.existent.key');
  });

  it('should return full translations object', () => {
    const { result } = renderHook(() => useI18n());
    expect(result.current.translations).toHaveProperty('common');
    expect(result.current.translations).toHaveProperty('dashboard');
    expect(result.current.translations).toHaveProperty('candidates');
  });
});
