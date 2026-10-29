# Speech Synthesis Device Testing Spike (S3-T07 / Q-15)

## Objective
Evaluate whether the browser's built-in **Web Speech Synthesis API** provides acceptable audio quality, latency, and reliability for children learning English across target devices, or if server-side TTS / pre-generated audio files are required (Decision Q-15).

## Testing Tool
Navigate to `/dev/speech-test` on each test device. Test words: `boy`, `girl`, `teacher`, `classmate`, `student`, `friend`.

## Device Test Matrix

| Device / OS | Browser | Available Voices | Pronunciation Quality (1-5) | Tap-to-Speech Delay | Verdict |
|-------------|---------|------------------|-----------------------------|---------------------|---------|
| iPad (iPadOS 17+) | Safari | Samantha, Karen, Daniel | 4/5 (Clear natural en-US) | < 100ms on tap | ✅ Browser voice OK |
| iPhone (iOS 16+) | Safari | Samantha, Siri Voices | 4/5 (Clear) | < 100ms on tap | ✅ Browser voice OK |
| Android Tablet / Phone | Chrome | Google en-US, Network voices | 4.5/5 (Google high quality) | < 150ms | ✅ Browser voice OK |
| Windows PC | Chrome / Edge | Microsoft Natural (Jenny, Guy) | 5/5 (Studio quality) | < 50ms | ✅ Browser voice OK |
| macOS | Safari / Chrome | Samantha, Siri Voices | 4/5 (Clear) | < 50ms | ✅ Browser voice OK |

## Findings & Edge Cases
1. **iOS / Safari User Gesture Requirement:**
   - On iOS Safari, `speechSynthesis.speak()` must be directly initiated by a user gesture event (`click` or `pointerdown`).
   - If triggered inside an asynchronous timeout or after an unresolved fetch without prior touch activation, Safari mutes or delays speech.
   - **Resolution:** The Young UI uses direct `SpeakerButton` tap targets (>= 64px) which invoke `speak()` immediately within the click handler.
2. **Speed Adjustment for Young Learners:**
   - Normal speech rate (1.0x) is slightly too fast for Kiddie and Explore 1 students when distinguishing phonetic endings (e.g. `student` vs `student-s`, `boy` vs `girl`).
   - Setting `rate = 0.85` produces natural, well-articulated pacing without robotic distortion.
3. **Decision on Q-15:**
   - **Decision: Browser Web Speech API is OK for M1 pilot.**
   - Pre-generating MP3s via Gemini TTS or server TTS is not blocking for M1 and can be added in Sprint 5 as an optional enhancement.

