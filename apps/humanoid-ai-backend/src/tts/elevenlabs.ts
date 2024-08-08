import axios from 'axios';
import * as fs from 'fs-extra';
import * as dotenv from 'dotenv';

dotenv.config();

const elevenLabsAPIV1 = "https://api.elevenlabs.io/v1";

class ElevenLabs {
    private apiKey: string;
    private voiceId: string;

    constructor(options: { apiKey: string; voiceId?: string }) {
        this.apiKey = options.apiKey ? options.apiKey : "";
        this.voiceId = options.voiceId ? options.voiceId : "pNInz6obpgDQGcFmaJgB"; // Default voice 'Adam'

        if (this.apiKey === "") {
            console.log("ERR: Missing API key");
            return;
        }
    }

    async textToSpeech({ voiceId, fileName, textInput, stability, similarityBoost, modelId, style, speakerBoost }: 
    { voiceId?: string; fileName: string; textInput: string; stability?: number; similarityBoost?: number; modelId?: string; style?: number; speakerBoost?: boolean }) {
        try {
            if (!fileName) {
                console.log("ERR: Missing parameter {fileName}");
                return;
            } else if (!textInput) {
                console.log("ERR: Missing parameter {textInput}");
                return;
            }

            const voiceIdValue = voiceId ? voiceId : this.voiceId;
            const voiceURL = `${elevenLabsAPIV1}/text-to-speech/${voiceIdValue}`;
            const stabilityValue = stability ? stability : 0;
            const similarityBoostValue = similarityBoost ? similarityBoost : 0;
            const styleValue = style ? style : 0;

            const response = await axios({
                method: "POST",
                url: voiceURL,
                data: {
                    text: textInput,
                    voice_settings: {
                        stability: stabilityValue,
                        similarity_boost: similarityBoostValue,
                        style: styleValue,
                        use_speaker_boost: speakerBoost,
                    },
                    model_id: modelId ? modelId : undefined,
                },
                headers: {
                    Accept: "audio/mpeg",
                    "xi-api-key": this.apiKey,
                    "Content-Type": "application/json",
                },
                responseType: "stream",
            });

            const writeStream = fs.createWriteStream(fileName);
            response.data.pipe(writeStream);

            return new Promise((resolve, reject) => {
                const responseJson = { status: "ok", fileName: fileName };
                writeStream.on('finish', () => resolve(responseJson));
                writeStream.on('error', reject);
            });
        } catch (error) {
            console.log(error);
        }
    }
}

export { ElevenLabs };
