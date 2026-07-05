import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type SyntheticEvent,
  type VideoHTMLAttributes,
} from "react";
import { cn } from "../lib/cn";
import { Icon } from "./Icon";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";

  const rounded = Math.floor(seconds);
  const minutes = Math.floor(rounded / 60);
  const remainingSeconds = rounded % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function rangeStyle(value: number): CSSProperties {
  return { "--px-range-value": `${Math.max(0, Math.min(100, value))}%` } as CSSProperties;
}

export interface VideoPlayerProps extends Omit<VideoHTMLAttributes<HTMLVideoElement>, "controls"> {
  /** Label shown in the top chrome. */
  label?: ReactNode;
  /** Optional text shown beside the duration/readout. */
  caption?: ReactNode;
  /** Aspect ratio for the video screen, e.g. "16 / 9" or "4 / 3". */
  aspectRatio?: CSSProperties["aspectRatio"];
  /** Stepped 8-bit corner silhouette. */
  pixelated?: boolean;
}

export function VideoPlayer({
  label,
  caption,
  aspectRatio,
  pixelated,
  className,
  style,
  children,
  preload = "metadata",
  playsInline = true,
  muted,
  onEnded,
  onLoadedMetadata,
  onPause,
  onPlay,
  onTimeUpdate,
  onVolumeChange,
  ...rest
}: VideoPlayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(Boolean(muted));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);

  useEffect(() => {
    setCanFullscreen(document.fullscreenEnabled);

    const updateFullscreen = () => {
      setIsFullscreen(document.fullscreenElement === rootRef.current);
    };

    document.addEventListener("fullscreenchange", updateFullscreen);
    return () => document.removeEventListener("fullscreenchange", updateFullscreen);
  }, []);

  const syncFromVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    setDuration(Number.isFinite(video.duration) ? video.duration : 0);
    setCurrentTime(video.currentTime || 0);
    setIsPlaying(!video.paused && !video.ended);
    setIsMuted(video.muted);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      void video.play().catch(syncFromVideo);
    } else {
      video.pause();
    }
  };

  const seek = (value: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = value;
    setCurrentTime(value);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const root = rootRef.current;
    if (!root) return;

    if (document.fullscreenElement === root) {
      void document.exitFullscreen().catch(() => setIsFullscreen(false));
    } else {
      void root.requestFullscreen().catch(() => setIsFullscreen(false));
    }
  };

  const handleLoadedMetadata = (event: SyntheticEvent<HTMLVideoElement>) => {
    syncFromVideo();
    onLoadedMetadata?.(event);
  };

  const handleTimeUpdate = (event: SyntheticEvent<HTMLVideoElement>) => {
    syncFromVideo();
    onTimeUpdate?.(event);
  };

  const handlePlay = (event: SyntheticEvent<HTMLVideoElement>) => {
    syncFromVideo();
    onPlay?.(event);
  };

  const handlePause = (event: SyntheticEvent<HTMLVideoElement>) => {
    syncFromVideo();
    onPause?.(event);
  };

  const handleVolumeChange = (event: SyntheticEvent<HTMLVideoElement>) => {
    syncFromVideo();
    onVolumeChange?.(event);
  };

  const handleEnded = (event: SyntheticEvent<HTMLVideoElement>) => {
    syncFromVideo();
    onEnded?.(event);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const currentLabel = formatTime(currentTime);
  const durationLabel = formatTime(duration);
  const controlsLabel = typeof label === "string" ? `${label} controls` : "Video controls";

  return (
    <div
      ref={rootRef}
      className={cn("px-video-player", pixelated && "px-pixelated", className)}
      style={aspectRatio ? ({ ...style, "--px-video-aspect": aspectRatio } as CSSProperties) : style}
    >
      {(label || caption) && (
        <div className="px-video-head">
          {label && <div className="px-video-title">{label}</div>}
          {caption && <div className="px-video-caption">{caption}</div>}
        </div>
      )}

      <div className="px-video-screen">
        <video
          ref={videoRef}
          controls={false}
          preload={preload}
          playsInline={playsInline}
          muted={muted}
          onClick={togglePlay}
          onEnded={handleEnded}
          onLoadedMetadata={handleLoadedMetadata}
          onPause={handlePause}
          onPlay={handlePlay}
          onTimeUpdate={handleTimeUpdate}
          onVolumeChange={handleVolumeChange}
          {...rest}
        >
          {children}
        </video>
        {canFullscreen && (
          <button
            type="button"
            className="px-video-button px-video-fullscreen"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            onClick={toggleFullscreen}
          >
            <Icon name="expand" size={24} />
          </button>
        )}
      </div>

      <div className="px-video-toolbar" aria-label={controlsLabel}>
        <button
          type="button"
          className="px-video-button"
          aria-label={isPlaying ? "Pause video" : "Play video"}
          onClick={togglePlay}
        >
          <Icon name={isPlaying ? "pause" : "play"} size={24} />
        </button>

        <div className="px-video-seek-group">
          <input
            className="px-video-range"
            type="range"
            min={0}
            max={duration || 0}
            step={0.01}
            value={duration > 0 ? currentTime : 0}
            disabled={duration <= 0}
            aria-label="Seek video"
            onChange={(event) => seek(Number(event.target.value))}
            style={rangeStyle(progress)}
          />
          <div className="px-video-time">
            <span>{currentLabel}</span>
            <span>{durationLabel}</span>
          </div>
        </div>

        <button
          type="button"
          className="px-video-button"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          onClick={toggleMute}
        >
          <Icon name={isMuted ? "sound-mute" : "sound-on"} size={24} />
        </button>
      </div>
    </div>
  );
}
