import { atomDialog } from '~/stores/context';
import { useNanoState } from './useNanoState';
import { useCallback } from 'react';

export function useDialog() {
  const [dialog, setDialog] = useNanoState(atomDialog);

  const open = useCallback((
    config: Partial<{
      title: string,
      template: React.ReactNode,
      width: number,
    }>
  ) => {
    setDialog({
      title: config.title || '',
      template: config.template,
      width: config.width || 520,
    })
  }, [setDialog]);

  const close = useCallback(() => {
    if (dialog == null) return;
    setDialog(null);
  }, [dialog, setDialog]);

  return {
    open,
    close,
  }
}