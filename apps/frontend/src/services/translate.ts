export const API_BASE_URL = 'http://localhost:5000/api';

export interface TranslateRequest {
  text: string;
  from: string;
  to: string;
}

export interface TranslateResponse {
  translatedText: string;
  from: string;
  to: string;
}

export const translateText = async (params: TranslateRequest): Promise<TranslateResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Translation failed');
    }

    return response.json();
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};