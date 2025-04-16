import { useStore } from '@nanostores/react';
import { useCallback, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import * as Tone from 'tone';
import { SAMPLE_RATE } from '~/common';
import { getMasterMixF32 } from '~/stores/context';
import { renderAllWaves } from '~/wavegen';
import { AudioPlayerContext } from './context';

export const AudioPlayerProvider = ({ children }: PropsWithChildren) => {
  const samples = useStore(getMasterMixF32);

  const [isPlayAll, setPlayAll] = useState<boolean>(false);

  const bufferRef = useRef<AudioBuffer>(Tone.getContext().createBuffer(1, 512, 44100));
  const playerRef = useRef<Tone.Player>(null);

  const onPlay = useCallback(async () => {
    if (isPlayAll) return;

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

  const onPlayAll = useCallback(async () => {
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current.dispose();
      playerRef.current = null;
    }

    setPlayAll(true);

    const rendered = renderAllWaves(SAMPLE_RATE);
    const buffer = Tone.getContext().createBuffer(1, rendered.length, 44100);

    playerRef.current = new Tone.Player({
      url: buffer,
      loop: true,
      loopStart: 0,
      loopEnd: buffer.length,
    }).toDestination();

    const f32Samples = new Float32Array(rendered.length);
    rendered.forEach((sample, i) => { f32Samples[i] = sample; });
    buffer.copyToChannel(f32Samples, 0);

    await Tone.start();
    playerRef.current.start();

  }, [playerRef, samples]);

  const onStop = useCallback(async () => {
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current.dispose();
      playerRef.current = null;

      setPlayAll(false);
    }
  }, [playerRef]);

  useEffect(() => {
    if (!isPlayAll && bufferRef.current && playerRef.current) {
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
        playAll: onPlayAll,
        stop: onStop,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}
