import { EXERCISES_DATA } from './exercises';

interface ExerciseVideoSource {
  youtubeId: string;
  videoUrl: string;
  source: string;
}

// Curated demonstrations matched to the exercise intent.
// Keep this list conservative: only add a video after checking that it teaches
// the same movement or a very close technical foundation used by the CourtLab drill.
export const EXERCISE_VIDEO_SOURCES: Record<string, ExerciseVideoSource> = {
  'bh-01': {
    youtubeId: 'w3rrWbACcHU',
    videoUrl: 'https://www.youtube.com/watch?v=w3rrWbACcHU',
    source: 'ILoveBasketballTV — The Best Way to Do a Crossover in Basketball'
  },
  'bh-02': {
    youtubeId: 'hkfQXij2kp4',
    videoUrl: 'https://www.youtube.com/watch?v=hkfQXij2kp4',
    source: 'ILoveBasketballTV — How To Dribble A Basketball BETWEEN The Legs'
  },
  'bh-03': {
    youtubeId: 'Ze9QKvjZxYQ',
    videoUrl: 'https://www.youtube.com/watch?v=Ze9QKvjZxYQ',
    source: 'ILoveBasketballTV — How to Dribble a Basketball BEHIND YOUR BACK'
  },
  'bh-05': {
    youtubeId: 'b73g2s6HpC4',
    videoUrl: 'https://www.youtube.com/watch?v=b73g2s6HpC4',
    source: 'Howcast — How to Do an In & Out Dribble'
  },
  'bh-06': {
    youtubeId: 'wkusPZJKkis',
    videoUrl: 'https://www.youtube.com/watch?v=wkusPZJKkis',
    source: 'Teach Hoops — Tennis Ball Dribble Drill'
  },
  'sh-01': {
    youtubeId: 'fttAr9-Yo9g',
    videoUrl: 'https://www.youtube.com/watch?v=fttAr9-Yo9g',
    source: 'ShotMechanics — The TRUE Fundamentals of Shooting Form'
  },
  'sh-02': {
    youtubeId: 'ow16151mQDE',
    videoUrl: 'https://www.youtube.com/watch?v=ow16151mQDE',
    source: 'ILoveBasketballTV — Catch and Shoot Drill for Shooting Footwork'
  },
  'fn-01': {
    youtubeId: 'Q1LiWKc8-Ls',
    videoUrl: 'https://www.youtube.com/watch?v=Q1LiWKc8-Ls',
    source: 'TeamSnap — The Mikan Drill'
  }
};

// Enrich the shared exercise objects once at app startup. This keeps the large
// exercise database clean while making videos available everywhere the same
// EXERCISES_DATA module instance is consumed.
EXERCISES_DATA.forEach((exercise) => {
  const video = EXERCISE_VIDEO_SOURCES[exercise.id];
  if (!video) return;
  exercise.youtubeId = video.youtubeId;
  exercise.videoUrl = video.videoUrl;
});
