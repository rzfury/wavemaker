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
          <div id="preview" className="flex flex-col gap-y-4 p-4">
            <MasterWavePreview />
          </div>
          <LFOShelf />
          <div id="mixer"></div>
        </main>
        <Dialog />
      </AudioPlayerProvider>
    </Fragment>
  )
}

export default App
