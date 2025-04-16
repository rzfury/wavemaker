import { Fragment } from 'react/jsx-runtime'
import MasterWavePreview from '~/components/layouts/MasterWavePreview'
import WaveShelf from '~/components/layouts/WaveShelf'
import Dialog from './components/layouts/Dialog'
import LFOShelf from './components/layouts/LFOShelf'
import { AudioPlayerProvider } from './contexts/audio-player/provider'

function App() {
  return (
    <Fragment>
      <AudioPlayerProvider>
        <main>
          <WaveShelf />
          <div id="preview" className="flex flex-col justify-between gap-y-4 p-4">
            <MasterWavePreview />
            <div className="flex flex-col gap-y-4 p-4 bg-zinc-800 shadow-md shadow-black/50">
              <div className="text-zinc-200">
                <span className="font-thin text-4xl italic">WaveMaker</span>
                <span className="text-4xl">&nbsp;</span>
                <small className="">by RZFury</small>
              </div>
            </div>
          </div>
          <LFOShelf />
        </main>
        <Dialog />
      </AudioPlayerProvider>
    </Fragment>
  )
}

export default App
