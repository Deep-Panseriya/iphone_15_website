import { useRef, useState } from 'react'
import { hightlightsSlides } from '../constants'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function VideoCarousel () {
  const videoRef = useRef([])
  const videoSpanRef = useRef([])
  const videoDivRef = useRef([])

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false
  })

  const [loadedData, setLoadedData] = useState([])
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video

  useGSAP(()=>{
    gsap.to('#video', {
        scrollTrigger: {
            trigger:'#video',
            toggleActions:'restart'
        },
      onComplete: () => {
          setVideo((pre) => ({
              ...pre,
              startPlay: true,
              isPlaying: true
          }));
      }
    });
  }, [isEnd, videoId])
  return (
    <>
      <div className='flex items-center'>
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id='slider' className='sm:pr-20 pr-10'>
            <div className='video-carousel_container'>
              <div
                className='w-full h-full 
            flex-center rounded-3xl bg-black overflow-hidden'
              >
                <video id='video' preload='auto' muted 
                playsInline={true} 
                ref={(el)=> (videoRef.current[i] = el)}>
                  <source src={list.video} type='video/mp4' />
                </video>
              </div>
              <div className='absolute top-12 left-[5%] z-10'>
                {list.textLists.map((text, i) => (
                  <p key={i} className='md:text-2xl text-xl font-medium'>
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
