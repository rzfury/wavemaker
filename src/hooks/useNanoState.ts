import { useStore } from '@nanostores/react'
import type { WritableAtom } from 'nanostores'
import { useCallback } from 'react'

export function useNanoState<T>(atom: WritableAtom<T>): [T, (newValue: T) => void] {
  const value = useStore(atom)

  const setValue = useCallback((value: T) => {
    atom.set(value)
  }, [atom])

  return [value, setValue]
}
