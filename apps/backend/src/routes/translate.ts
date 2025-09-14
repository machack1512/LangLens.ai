import { Router, Request, Response } from 'express';
import { translate } from '@vitalets/google-translate-api';
import rateLimit from 'express-rate-limit';

const router: Router = Router();

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

router.use(limiter);

router.post('/', async (req: Request, res: Response) => {
  try {
    const { text, from, to } = req.body;

    if (!text || !from || !to) {
      return res.status(400).json({ 
        error: 'Missing required fields: text, from, and to languages are required' 
      });
    }

    const result = await translate(text, { from, to });

    res.json({
      translatedText: result.text,
      to
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      error: 'Translation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;