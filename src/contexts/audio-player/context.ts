import { createContext } from 'react';
import * as Tone from 'tone';

export const AudioPlayerContext = createContext<{
  player?: Maybe<Tone.Player>,
  play?: () => void,
  stop?: () => void,
}>({});
