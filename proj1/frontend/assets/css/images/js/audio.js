let recorder;
let audioChunks = [];

document.getElementById("recordButton").addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => audioChunks.push(event.data);
  recorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.src = audioUrl;
  };
  recorder.start();
});

document.getElementById("stopButton").addEventListener("click", () => {
  recorder.stop();
});
