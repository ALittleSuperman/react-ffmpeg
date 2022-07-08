import React, {useState} from 'react';
import {createFFmpeg, fetchFile} from "@ffmpeg/ffmpeg";
import './app.css'
function App() {
    const ffmpeg = createFFmpeg({ log: true });
    const [video, setVideo] = useState<File>()
    const [subtitle, setSubtitle] = useState<File>()
    const [voice, setVoice] = useState<File>()
    const changeVideo = async () => {
        // @ts-ignore
        const videoTarget: any = document.querySelector('#video')
        const Video: any = document.querySelector('#v')
        const file = videoTarget.files[0]
        setVideo(file)

        const Url = URL.createObjectURL(file)
        Video.src = Url
    }
    const changeSubtitle = async () => {
        const target:any = document.querySelector('#subtitle')
        const subtitle = target.files[0]
        setSubtitle(subtitle)
    }
    const changeVoice = async () => {
        const target:any = document.querySelector('#voice')
        const voice = target.files[0]
        setVoice(voice)
    }
    const synthetic = async () => {
        await ffmpeg.load()
        const dataVideo = await fetchFile(video as unknown as File)
        const dataVoice = await fetchFile(voice as unknown as File)
        const subtitleVoice = await fetchFile(subtitle as unknown as File)
        // @ts-ignore
        ffmpeg.FS('writeFile', video.name, dataVideo);
        // @ts-ignore
        ffmpeg.FS('writeFile', voice.name, dataVoice);
        // @ts-ignore
        ffmpeg.FS('writeFile', subtitle.name, subtitleVoice);
        // @ts-ignore
        await ffmpeg.run('-i', video.name, '-i', voice.name,'-vf', `subtitles=${subtitle.name}`, '-c:a', 'aac', '-strict', 'experimental', '-map', '0:v:0', '-map', '1:a:0', 'output.mp4');
        const data =  ffmpeg.FS('readFile', 'output.mp4');
        console.log('success')
        const videoTarget: any = document.querySelector('#v')
        videoTarget.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    }
  return (
    <div className="wrapper">
      <div className="viewContainer">
        <video
            controls
            width="100%"
            id="v"
        ></video>
          <div className="controls">
              <div>
                  视频：<input type="file" onChange={changeVideo} id="video" />
              </div>
              <div>字幕：<input type="file" id="subtitle" onChange={changeSubtitle}></input></div>
              <div>配音：<input type="file" id="voice" onChange={changeVoice} /></div>
          </div>
          <button onClick={synthetic}>开始合成</button>
      </div>
    </div>
  );
}

export default App;
