import { useStore } from '@nanostores/react'
import type { ReadableAtom } from 'nanostores'

export function useReadOnlyState<T>(atom: ReadableAtom<T>): T {
  const value = useStore(atom)
  return value
}
