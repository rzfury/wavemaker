import { useStore } from '@nanostores/react';
import { useCallback, useEffect, useRef, type PropsWithChildren } from 'react';
import * as Tone from 'tone';
import { SAMPLE_RATE } from '~/common';
import { atomControls, atomOscillators, getMasterMixF32 } from '~/stores/context';
import { AudioPlayerContext } from './context';

export const AudioPlayerProvider = ({ children }: PropsWithChildren) => {
  const samples = useStore(getMasterMixF32);

  const oscillators = useStore(atomOscillators);
  const controls = useStore(atomControls);

  const bufferRef = useRef<AudioBuffer>(Tone.getContext().createBuffer(1, 512, 44100));
  const playerRef = useRef<Tone.Player>(null);

  const onPlay = useCallback(async () => {
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current.dispose();
      playerRef.current = null;
    }

    playerRef.current = new Tone.Player({
      url: bufferRef.current,
      loop: true,
      loopStart: 0,
      loopEnd: SAMPLE_RATE,
    }).toDestination();
    
    bufferRef.current.copyToChannel(samples, 0);

    await Tone.start();

    playerRef.current.start();
  }, [playerRef, samples]);

  const onStop = useCallback(async () => {
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current.dispose();
      playerRef.current = null;
    }
  }, [playerRef]);

  useEffect(() => {
    if (bufferRef.current && playerRef.current) {
      bufferRef.current.copyToChannel(samples, 0);
      playerRef.current.set({ url: bufferRef.current });
      playerRef.current.stop();
      playerRef.current.start();
    }
  }, [samples]);

  return (
    <AudioPlayerContext.Provider
      value={{
        player: playerRef.current,
        play: onPlay,
        stop: onStop,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}
