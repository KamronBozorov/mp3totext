import whisperx
import sys


def transcribe(audio_file: str, model_name: str = "medium", device: str = "cpu"):
    model = whisperx.load_model(model_name, device=device, compute_type="float32")
    result = model.transcribe(audio_file)

    print("RESULT:", result)
    print("RESULT KEYS:", result.keys())
    if "language" in result:
        print("LANGUAGE:", result["language"])
    else:
        print("language key not found in result")
    sys.stdout.flush()


if __name__ == "__main__":
    audio_path = sys.argv[1]
    transcribe(audio_path)
