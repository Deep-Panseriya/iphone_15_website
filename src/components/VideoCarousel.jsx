import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

import { useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";

const VideoCarousel = () => {
  const videoRef = useRef([]); //Actual <video> elements.
  const videoSpanRef = useRef([]);//The progress span inside each dot.
  const videoDivRef = useRef([]);//The progress dot divs themselves.
  const containerRef = useRef(null);

  const [videoState, setVideoState] = useState({
    videoId: 0,
    isPlaying: true,
    isLastVideo: false,
    startPlay: true,
  });

  const [loadedCount, setLoadedCount] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const { videoId, isPlaying, isLastVideo, startPlay } = videoState;

  const getDotWidth = () => {
    if (window.innerWidth < 760) return "10vw";
    if (window.innerWidth < 1200) return "10vw";
    return "4vw";
  };

  // GSAP slide shift animation
  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });
  }, [videoId]);

  //When a video loads, we store its duration to sync the progress bar animation.
  const handleLoadedMetadata = () => {
    setLoadedCount((count) => count + 1);
    const currentVideo = videoRef.current[videoId];
    if (currentVideo) {
      setVideoDuration(currentVideo.duration);
    }
  };

  // Play/pause video logic
  useEffect(() => {
    if (loadedCount < hightlightsSlides.length) return;

    const currentVideo = videoRef.current[videoId];
    if (!currentVideo) return;

    if (isPlaying && startPlay) {
      currentVideo.play();
    } else {
      currentVideo.pause();
    }
  }, [videoId, isPlaying, startPlay, loadedCount]);

  // Dot resizing and progress fill animation
  useEffect(() => {
    if (loadedCount < hightlightsSlides.length || videoDuration === 0) return;

    const currentVideo = videoRef.current[videoId];
    const span = videoSpanRef.current[videoId];

    // Resize dots
    videoDivRef.current.forEach((el, i) => {
      if (el) {
        gsap.to(el, {
          width: i === videoId ? getDotWidth() : "12px",
          duration: 0.3,
          ease: "power1.out",
        });
      }
    });

    // Kill previous animations
    videoSpanRef.current.forEach((el) => gsap.killTweensOf(el));

    // Animate fill
    if (isPlaying) {
      gsap.fromTo(
        span,
        { width: "0%" },
        {
          width: "100%",
          duration: currentVideo.duration || videoDuration,
          ease: "linear",
        }
      );

      const updateProgress = () => {
        const currentTime = currentVideo.currentTime;
        const duration = currentVideo.duration || videoDuration;
        const progress = Math.min((currentTime / duration) * 100, 100);
        gsap.set(span, { width: `${progress}%` });

        // Edge case fix to ensure 100% fill
        if (duration - currentTime < 0.2 && currentTime > 0) {
          gsap.set(span, { width: "100%" });
        }
      };

      currentVideo.addEventListener("timeupdate", updateProgress);

      return () => {
        currentVideo.removeEventListener("timeupdate", updateProgress);
      };
    } else {
      const progress = Math.min(
        (currentVideo.currentTime / (currentVideo.duration || videoDuration)) *
          100,
        100
      );
      gsap.set(span, { width: `${progress}%` });
    }
  }, [videoId, isPlaying, videoDuration, loadedCount]);

  // Handle video end
  const handleVideoEnd = () => {
    const isLast = videoId === hightlightsSlides.length - 1;

    // Set fill to 100% manually
    const span = videoSpanRef.current[videoId];
    if (span) gsap.set(span, { width: "100%" });

    setVideoState((prev) => ({
      ...prev,
      videoId: isLast ? prev.videoId : prev.videoId + 1,
      isPlaying: !isLast,
      isLastVideo: isLast,
      startPlay: !isLast,
    }));
  };

  const handleControlClick = () => {
    if (isLastVideo) {
      setVideoState({
        videoId: 0,
        isPlaying: true,
        isLastVideo: false,
        startPlay: true,
      });
    } else {
      setVideoState((prev) => ({
        ...prev,
        isPlaying: !prev.isPlaying,
        startPlay: true,
      }));
    }
  };

  return (
    <>
      <div className="flex items-center" ref={containerRef}>
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline
                  className={`${
                    list.id === 2 ? "translate-x-44" : ""
                  } pointer-events-none`}
                  preload="auto"
                  muted
                  ref={(el) => (videoRef.current[i] = el)}
                  onEnded={handleVideoEnd}
                  onPlay={() =>
                    setVideoState((prev) => ({
                      ...prev,
                      isPlaying: true,
                      startPlay: true,
                    }))
                  }
                  onLoadedMetadata={handleLoadedMetadata}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text, idx) => (
                  <p key={idx} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {hightlightsSlides.map((_, i) => (
            <span
              key={i}
              className="mx-2 h-3 bg-gray-200 rounded-full relative cursor-pointer overflow-hidden"
              ref={(el) => (videoDivRef.current[i] = el)}
              style={{
                width: i === videoId ? getDotWidth() : "12px",
                transition: "width 0.3s ease",
              }}
              onClick={() =>
                setVideoState((prev) => ({
                  ...prev,
                  videoId: i,
                  isLastVideo: false,
                  isPlaying: true,
                  startPlay: true,
                }))
              }
            >
              <span
                className="absolute left-0 top-0 h-full rounded-full bg-white"
                ref={(el) => (videoSpanRef.current[i] = el)}
                style={{ width: "0%" }}
              />
            </span>
          ))}
        </div>

        <button className="control-btn" onClick={handleControlClick}>
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
