'use client';

import { useState, useRef, useCallback } from 'react';

export interface Recording {
  id: string;
  blob: Blob;
  url: string;
  buffer: AudioBuffer | null;
  duration: number;
}

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [micDenied, setMicDenied] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      setMicDenied(false);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setRecordingTime((Date.now() - startTimeRef.current) / 1000);
      }, 100);
    } catch {
      setMicDenied(true);
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<Recording | null> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state !== 'recording') {
        resolve(null);
        return;
      }

      recorder.onstop = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRecording(false);

        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);

        // Decode to AudioBuffer
        let buffer: AudioBuffer | null = null;
        try {
          const ctx = new AudioContext();
          const arrayBuf = await blob.arrayBuffer();
          buffer = await ctx.decodeAudioData(arrayBuf);
          ctx.close();
        } catch {
          // Could not decode
        }

        // Stop microphone
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;

        const duration = recordingTime || (buffer?.duration ?? 0);
        const recording: Recording = {
          id: Date.now().toString(36),
          blob,
          url,
          buffer,
          duration,
        };
        setRecordingTime(0);
        resolve(recording);
      };

      recorder.stop();
    });
  }, [recordingTime]);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setIsRecording(false);
    setRecordingTime(0);
  }, []);

  return { isRecording, recordingTime, micDenied, startRecording, stopRecording, cancelRecording };
}
